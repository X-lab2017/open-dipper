# OpenGalaxy / ModelGalaxy snapshots

These assets retain every node and edge in the pinned upstream graphs. They are sourced network snapshots, not a live global inventory. No upstream application code is included.

Source: [YaoYao-Pig/OG-And-HG-2026](https://github.com/YaoYao-Pig/OG-And-HG-2026/tree/7f69f2fbd27860f1f207be197dfe0597216d7b0d), commit `7f69f2fbd27860f1f207be197dfe0597216d7b0d`.

| Asset | Coverage | Observation period |
| --- | --- | --- |
| `code.json` | 19,771 GitHub repositories; 106,650 shared-contributor affinity edges | August 2025–July 2026 |
| `model.json` | 12,000 models, 7,000 datasets, 5,000 Spaces; 19,305 declared/publisher edges and 23,958 inferred edges | Upstream HF dataset snapshot: 2026-08-05T13:32:27.000Z |

The HF selection uses contiguous dataset-order pages, not a random or representative sample. A later import/build date does not update the observation date. The code network is the connected subset of a top-20,000 candidate selection after edge pruning; it does not contain all GitHub repositories.

## Serialization and meaning

- Nodes preserve stable upstream IDs, original x/y layout coordinates, size weights, community, category, platform URL and available facts. Long descriptions are clipped to 160 Unicode characters and topics to five items of at most 50 characters; no relationships are synthesized.
- Each edge is `[sourceIndex, targetIndex, strength, relationTypeIndex, sharedContributorsOrNull, inferred]`. Indices address the `nodes` array; relation type addresses `meta.relationTypes`.
- Code edges mean shared known non-bot contributors, not direct project cooperation, code dependency or similarity. Their strength is an upstream visualization weight; it is not a general contribution score.
- Code `openrank` and `size` are the sum of twelve inherited monthly Global OpenRank values. They are not a separately computed annual OpenRank.
- Model `size` is the upstream composite display weight, not OpenRank, model capability or quality. Downloads and likes preserve the supplied snapshot fields. Model `contributors` is intentionally absent: upstream zeroes are placeholders, not observed counts.
- Model relation types remain distinct: `base-model`, `declared-dataset`, `uses-model`, `uses-dataset`, `same-author`, `inferred-task`, `inferred-taxonomy`. Inferred relations must have a separate control and visible disclosure.
- Model pairs are undirected in the source export. Do not draw parent-child arrows or label an endpoint as parent from index order. Directional ancestry needs an additional verified source.
- `author` is an account namespace parsed from the identifier, not a verified legal organization. Coordinates express layout, not geography or a quantitative similarity scale. Macro communities are layout groupings, not automatically technical categories.

## Reproduce and check

```sh
python3 scripts/import-galaxy.py
python3 scripts/import-galaxy.py --source-dir /path/to/pinned-source-files
python3 scripts/import-galaxy.py --check
node --test tests/galaxy-data.test.mjs
```

The importer pins full source SHA-256 hashes, limits input/output size and validates nodes, URLs, endpoints, counts and inferred semantics before replacing assets. `--check` uses committed files only: no network or writes. `manifest.json` records output fingerprints. Rebuilds are deterministic and do not refresh dates.

Attribution: OpenGalaxy / ModelGalaxy by YaoYao-Pig, OpenDigger for GitHub collaboration inputs, and [cfahlgren1/hub-stats](https://huggingface.co/datasets/cfahlgren1/hub-stats) for HF metadata. Data reuse was requested by the project maintainer. The upstream repository has no detected repository-wide application license; no new license or rights are granted here. The HF dataset declares Apache-2.0 in its supplied provenance; individual model/dataset licenses and branding remain separate. See the repository's [rights record](../../../docs/RIGHTS.md).
