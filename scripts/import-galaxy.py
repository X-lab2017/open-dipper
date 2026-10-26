#!/usr/bin/env python3
"""Import pinned OpenGalaxy / ModelGalaxy facts, without upstream application code.

Default: download the two immutable, hash-checked source files and rebuild assets.
--source-dir DIR: use previously downloaded files; no network.
--check: validate the committed outputs and manifest; no network and no writes.
"""

from __future__ import annotations

import argparse
from collections import Counter
import hashlib
import json
import math
from pathlib import Path
import sys
import tempfile
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "data" / "galaxy"
REPOSITORY = "YaoYao-Pig/OG-And-HG-2026"
COMMIT = "7f69f2fbd27860f1f207be197dfe0597216d7b0d"
MAX_SOURCE_BYTES = 32_000_000
MAX_OUTPUT_BYTES = 12_582_912
SOURCES = {
    "code": {
        "file": "graph.json",
        "sha256": "a7ff47bcb4f4cdd2169cc92ba3da1fb2fbac159c66f78c79fb87098b1b1232bf",
        "nodes": 19771,
        "edges": 106650,
    },
    "model": {
        "file": "huggingface.json",
        "sha256": "ea2acd2cdbc320893e42fa8bbbc0bf18fa6257f008055f7140752337a481b445",
        "nodes": 24000,
        "edges": 43263,
    },
}


def digest(raw: bytes) -> str:
    return hashlib.sha256(raw).hexdigest()


def encode(value: object) -> bytes:
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":"), allow_nan=False) + "\n").encode()


def source_url(source: str) -> str:
    return f"https://raw.githubusercontent.com/{REPOSITORY}/{COMMIT}/visualization/public/data/{SOURCES[source]['file']}"


def finite(value: object, field: str, *, nonnegative: bool = False) -> float | int:
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f"{field}: expected a finite number")
    if nonnegative and value < 0:
        raise ValueError(f"{field}: negative value")
    return value


def category(node: dict, field: str) -> str:
    value = node.get("areas", {}).get(field, {})
    return str(value.get("primary") or "Unclassified") if isinstance(value, dict) else str(value or "Unclassified")


def normalise(source: str, raw: bytes) -> dict:
    spec = SOURCES[source]
    if digest(raw) != spec["sha256"]:
        raise ValueError(f"{source}: source SHA-256 does not match the pinned commit")
    original = json.loads(raw)
    source_meta = original["meta"]
    if len(original["nodes"]) != spec["nodes"] or len(original["edges"]) != spec["edges"]:
        raise ValueError(f"{source}: unexpected source counts")
    relation_types = sorted({str(edge.get("kind", "shared-contributors")) for edge in original["edges"]})
    nodes = []
    for original_node in original["nodes"]:
        name = original_node["name"]
        node = {
            "id": original_node["id"],
            "name": name,
            "x": original_node["x"],
            "y": original_node["y"],
            "size": original_node["r"],
            "community": original_node["c"],
            "category": category(original_node, "domain" if source == "code" else "task"),
            "kind": "repository" if source == "code" else original_node["sourceType"],
            "url": original_node["url"],
            "author": name.split("/", 1)[0],
            "degree": original_node["degree"],
        }
        if source == "code":
            node["contributors"] = original_node["contributors"]
            node["openrank"] = original_node["r"]
            node["language"] = original_node.get("lang", "Unknown")
        else:
            # The upstream HF serializer uses contributors=0 as a placeholder.
            # Omit that field; it is not an observed zero or a comparable metric.
            for key in ("downloads", "likes", "trending"):
                if key in original_node:
                    node[key] = original_node[key]
        description = original_node.get("description", "").strip()
        if description:
            node["description"] = description[:160]
        topics = original_node.get("topics", [])
        if isinstance(topics, str):
            topics = topics.split("|")
        topics = [str(item)[:50] for item in topics[:5] if item]
        if topics:
            node["topics"] = topics
        nodes.append(node)
    edges = [
        [
            edge["s"], edge["t"], edge["strength"],
            relation_types.index(edge.get("kind", "shared-contributors")),
            edge.get("shared"), int(edge.get("inferred", 0)),
        ]
        for edge in original["edges"]
    ]
    categories = Counter(node["category"] for node in nodes)
    kinds = Counter(node["kind"] for node in nodes)
    relation_counts = Counter(relation_types[edge[3]] for edge in edges)
    inferred = sum(edge[5] for edge in edges)
    meta = {
        "schemaVersion": 1,
        "source": source,
        "sourceCommit": COMMIT,
        "upstreamUrl": f"https://github.com/{REPOSITORY}/blob/{COMMIT}/visualization/public/data/{spec['file']}",
        "sourceSha256": digest(raw),
        "sourceBytes": len(raw),
        "nodeCount": len(nodes),
        "edgeCount": len(edges),
        "observedEdgeCount": len(edges) - inferred,
        "inferredEdgeCount": inferred,
        "relationTypes": relation_types,
        "relationCounts": dict(sorted(relation_counts.items())),
        "edgeTuple": ["sourceIndex", "targetIndex", "strength", "relationTypeIndex", "sharedContributorsOrNull", "inferred"],
        "direction": "undirected",
        "lineageDirectionAvailable": False,
        "sizeMetric": "openrank-sum-12-months" if source == "code" else "upstream-display-weight",
        "positionSemantics": "Upstream precomputed network-layout coordinates; not geographic distance or a quantitative similarity scale.",
        "authorSemantics": "Account namespace parsed from the repository identifier; not a verified legal organization.",
        "categories": [
            {"id": name, "label": name, "count": count}
            for name, count in sorted(categories.items(), key=lambda item: (-item[1], item[0]))
        ],
        "kinds": dict(sorted(kinds.items())),
        "bounds": source_meta["bounds"],
        "communities": [
            {key: community[key] for key in ("id", "count", "label", "x", "y", "radius") if key in community}
            for community in source_meta.get("communities", [])
        ],
    }
    if source == "code":
        meta.update({
            "period": source_meta["period"],
            "scope": "Connected subset of the top 20,000 candidate GitHub repositories selected by 12-month OpenRank. Edges are shared known non-bot contributor affinity, not direct cooperation or code dependencies.",
            "sizeSemantics": "Sum of 12 inherited monthly Global OpenRank scores, not an independently computed annual OpenRank.",
        })
    else:
        meta.update({
            "snapshotAt": source_meta["snapshotAt"],
            "sourceRevision": source_meta["sourceRevision"],
            "datasetUrl": source_meta["sourceUrl"],
            "datasetLicense": source_meta.get("sourceLicense"),
            "sampling": source_meta["sampling"],
            "scope": "Contiguous dataset-order samples: 12,000 models, 7,000 datasets and 5,000 Spaces. Not a complete inventory or a statistically representative sample. Declared relations and inferred task/taxonomy links remain separate.",
            "sizeSemantics": "Upstream composite display weight, not OpenRank, quality or model capability. Downloads/likes retain upstream snapshot values; they are not real-time counts.",
            "directionNote": "The upstream export canonicalizes pairs and does not retain parent-child orientation. Show base-model association without ancestry arrows until directional source records are added.",
        })
    result = {"meta": meta, "nodes": nodes, "edges": edges}
    validate(result)
    return result


def validate(graph: dict) -> None:
    meta, nodes, edges = graph["meta"], graph["nodes"], graph["edges"]
    spec = SOURCES[meta["source"]]
    if meta["sourceCommit"] != COMMIT or meta["sourceSha256"] != spec["sha256"]:
        raise ValueError("Incorrect provenance")
    if len(nodes) != meta["nodeCount"] or len(edges) != meta["edgeCount"]:
        raise ValueError("Count metadata mismatch")
    if len(nodes) != spec["nodes"] or len(edges) != spec["edges"]:
        raise ValueError("Pinned graph coverage changed")
    if len({node["id"] for node in nodes}) != len(nodes):
        raise ValueError("Duplicate node identifiers")
    allowed_hosts = {"github.com"} if meta["source"] == "code" else {"huggingface.co"}
    for node in nodes:
        if not isinstance(node["name"], str) or not node["name"]:
            raise ValueError("Empty node identity")
        url = urlsplit(node["url"])
        if url.scheme != "https" or url.hostname not in allowed_hosts or url.username or url.password:
            raise ValueError("Unexpected node URL")
        for field in ("x", "y", "size", "degree"):
            finite(node[field], field, nonnegative=field in {"size", "degree"})
        for field in ("contributors", "openrank", "downloads", "likes", "trending"):
            if field in node:
                finite(node[field], field, nonnegative=True)
        if meta["source"] == "model" and ("openrank" in node or "contributors" in node):
            raise ValueError("HF missing observations must not become zero values")
    pairs = set()
    for edge in edges:
        if len(edge) != 6:
            raise ValueError("Invalid edge tuple")
        source, target, strength, relation, shared, inferred = edge
        if any(type(i) is not int or not 0 <= i < len(nodes) for i in (source, target)) or source == target:
            raise ValueError("Invalid edge endpoints")
        pair = tuple(sorted((source, target)))
        if pair in pairs:
            raise ValueError("Duplicate edge")
        pairs.add(pair)
        finite(strength, "strength", nonnegative=True)
        if type(relation) is not int or not 0 <= relation < len(meta["relationTypes"]):
            raise ValueError("Unknown relation")
        if inferred not in (0, 1) or bool(inferred) != meta["relationTypes"][relation].startswith("inferred-"):
            raise ValueError("Inferred relation metadata mismatch")
        if shared is not None:
            finite(shared, "shared", nonnegative=True)
    if sum(edge[5] for edge in edges) != meta["inferredEdgeCount"]:
        raise ValueError("Inference count mismatch")


def read_source(source: str, source_dir: Path | None) -> bytes:
    if source_dir:
        path = source_dir / str(SOURCES[source]["file"])
        if path.stat().st_size > MAX_SOURCE_BYTES:
            raise ValueError("Source file exceeds size limit")
        return path.read_bytes()
    request = Request(source_url(source), headers={"User-Agent": "OpenDipper-Galaxy-Importer/1"})
    with urlopen(request, timeout=60) as response:
        raw = response.read(MAX_SOURCE_BYTES + 1)
    if len(raw) > MAX_SOURCE_BYTES:
        raise ValueError("Source download exceeds size limit")
    return raw


def check() -> None:
    manifest = json.loads((OUTPUT / "manifest.json").read_text())
    if manifest["sourceCommit"] != COMMIT:
        raise ValueError("Manifest commit mismatch")
    for source in SOURCES:
        raw = (OUTPUT / f"{source}.json").read_bytes()
        entry = manifest["files"][f"{source}.json"]
        if digest(raw) != entry["sha256"] or len(raw) != entry["bytes"]:
            raise ValueError(f"{source}: asset fingerprint mismatch")
        if len(raw) > MAX_OUTPUT_BYTES:
            raise ValueError(f"{source}: asset exceeds budget")
        validate(json.loads(raw))
    print("Galaxy assets: counts, provenance, fingerprints, endpoints and inference semantics verified.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check()
        return
    prepared = {}
    for source in SOURCES:
        raw = encode(normalise(source, read_source(source, args.source_dir)))
        if len(raw) > MAX_OUTPUT_BYTES:
            raise ValueError(f"{source}: compact output exceeds budget")
        prepared[f"{source}.json"] = raw
    manifest = {
        "schemaVersion": 1,
        "sourceRepository": f"https://github.com/{REPOSITORY}",
        "sourceCommit": COMMIT,
        "files": {name: {"sha256": digest(raw), "bytes": len(raw)} for name, raw in prepared.items()},
        "reproducible": True,
        "attribution": "OpenGalaxy / ModelGalaxy by YaoYao-Pig; GitHub collaboration inputs from OpenDigger; Hugging Face metadata from cfahlgren1/hub-stats.",
        "rights": "Data reuse requested by the project maintainer. No repository-wide upstream application license was found; this importer does not copy upstream application code or grant additional rights to source data, models or brands.",
    }
    prepared["manifest.json"] = encode(manifest)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, raw in prepared.items():
        with tempfile.NamedTemporaryFile(dir=OUTPUT, delete=False) as handle:
            handle.write(raw)
            temporary = Path(handle.name)
        temporary.replace(OUTPUT / name)
    check()
    print(json.dumps(manifest["files"], indent=2))


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, KeyError, TypeError) as error:
        print(f"Galaxy import failed: {error}", file=sys.stderr)
        sys.exit(1)
