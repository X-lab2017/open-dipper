# Open Galaxy / 开源星系

Implementation 1.5.1; public release validation is recorded in [the release plan](plans/ecosystem-public-release.md). The accepted map/radar baseline remains 1.3.2. This module replaces the ecosystem card landing page, at `#ecosystem`; it does not change the map, globe or radar's data.

## User outcome and interface

Choose a task → discover candidates → inspect a neighborhood or recorded connection path → shortlist and compare evidence → generate an actionable, sourced project report → verify gaps and visit the community. A full-screen network is the primary visual; filters and profiles support exploration.

- Universe, code and model views; 43,771 actual source nodes with stable precomputed coordinates. The two networks are normalized separately; there are no fabricated bridges.
- Domain/task, entity type and relationship controls, an accessible paginated list, search-and-fly navigation, node selection, neighbor highlighting, relationship explanation and exploration breadcrumbs.
- Search narrows the result list while retaining the surrounding graph. Domain/type filters change the graph. A selected node never silently becomes an unrelated node.
- Recorded relationships default on; model inference defaults off. Inferred edges have their own control, dashed rendering and explanation. Neither geometry nor edge strength measures a universal similarity or quality score.
- Relations / Peers / Metrics / Participate tabs. OpenDigger monthly history appears only for matching existing samples; other nodes show a clear missing-series state. Local watches are stored under `od:galaxy-watch` without cloud sync or notifications.
- Guided tour is an explicit camera presentation, not live activity. Manual interactions, Escape, tab hiding and navigation stop it. Reduced motion uses immediate camera positioning.
- Page-level galaxy expansion has a visible return, Escape, focus restoration and inert global navigation. Global browser fullscreen stays a separate shell operation. One-screen desktop, optional two-screen catalog, mobile flow, English/Chinese and light/dark themes remain supported.
- AI radar profiles provide “Locate in the galaxy.” Exact canonical URL matching selects a graph node; uncovered candidates get an explicit sample-coverage message and a name search.

## Discovery and research

- Four curated task entrances: agents, retrieval/RAG, inference/serving and training/evaluation data. Matches disclose curated entry points, category, metadata or entity-type rules; they are not adoption recommendations. Search weights exact identity, name, topics, language and descriptions, with bounded Chinese aliases. No LLM or remote query is invoked.
- A local shortlist holds up to three canonical source IDs (`od:galaxy-shortlist`). Same-source, same-type objects expose comparable snapshot measures; mixed types form a component collection without a synthesized score. No cloud sync, team sharing or notification delivery is claimed.
- Recorded paths use a breadth-first traversal of at most three hops. Inferred edges and fabricated cross-network bridges are excluded. A missing path means only that no qualifying path was found in this snapshot. Shared-contributor or publisher paths are not software dependency chains.
- Same-domain candidates share source, entity type and category, then prioritize overlapping topics/language. They are research leads, not verified functional alternatives.
- Reports retain canonical identity, observation and generation times, per-metric source/period, recorded versus inferred neighbors, a small relationship diagram, same-cohort sample rank, known license metadata, monthly history, exact-repository collected updates, gaps and next steps.
- Existing radar catalog enrichment joins **exact canonical URLs**, never names; this distinguishes identically named model and Space pages. 145 graph objects currently match the catalog. Only catalog evidence is read, never simulated radar assessments. Enrichment reads the current catalog after its independent asynchronous load; it is not frozen to an initial empty state.
- Graph degree is recomputed from unique recorded neighbors. All 5,000 Space download zeros in the source are inapplicable placeholders and are suppressed; Space sample ranks use likes. Unknown fields remain unknown. Code twelve-month OpenRank sums, Landscape monthly metrics, unspecified-window graph downloads and GOSD thirty-day downloads keep separate periods.
- Markdown, JSON and self-contained printable HTML export locally. HTML includes its own style and print-to-PDF action. Reports summarize collected evidence; they do not perform live Agent research, security auditing, license approval or independent capability/cost testing. Evidence coverage is not a quality score.
- Circular scope framing, landmark halos, selected-node pulses and bidirectional relationship particles support visual orientation. These are visual effects, not observed activity; the motion toggle and reduced-motion preference control animation.

## Data contract

See [versioned assets and provenance](../public/data/galaxy/README.md). Upstream commit: `7f69f2fbd27860f1f207be197dfe0597216d7b0d` from the maintainer-provided OG-And-HG-2026 repository.

| Network | Scope | Observation |
| --- | --- | --- |
| Code | 19,771 selected connected GitHub repositories; 106,650 shared-contributor affinity edges | 2025.08–2026.07 |
| Model | 12,000 models, 7,000 datasets, 5,000 Spaces; 19,305 recorded and 23,958 inferred edges | 2026-08-05 HF metadata snapshot |

Code size uses a compressed mapping of the twelve monthly inherited OpenRank scores' sum. Model size uses the upstream display weight, not OpenRank, performance or quality. Sizes are normalized within each source. HF download windows are not supplied by the graph, so the UI says snapshot downloads. Missing contributors are absent, not zero.

The model export sorts endpoints and discards recoverable direction; relations are therefore drawn without arrows. Same publisher means an account identifier, not verified legal organization. Inferred task/taxonomy links do not establish ancestry or direct cooperation. Data dates never advance on a browser refresh.

## Engineering boundary

- `src/galaxy/model.ts`: bounded runtime validation, independent normalization, filters, neighbor queries, URL matching and relationship labels.
- `src/galaxy/discovery.ts`: task rules, weighted discovery ordering, recorded degrees, same-domain peers, bounded shortlist and path traversal.
- `src/galaxy/report.ts`: pure evidence/report builder and escaped HTML/Markdown exports; JSON retains the structured evidence.
- `src/galaxy/scene.ts`: independently implemented Canvas renderer, community-density shading, bounded edge rendering, camera/pointer/keyboard behavior and disposal. The selected neighborhood is prioritized; overview does not draw every edge at once.
- `src/galaxy/view.ts`: lazy, independent source loading; partial failure/retry; profile, local state, tour, scope and guide.
- `src/galaxy/galaxy.css` and `research.css`: module, comparison and report layouts using existing generated design tokens.
- `scripts/import-galaxy.py`: immutable, fingerprinted, deterministic data import. Application code from the upstream project is not copied.

Graph loading does not join the atlas's required startup fetches. If one network fails, the other remains available with an explicit retry. If both fail, the page shows retry and the other product sections remain navigable. Pending source requests are shared across rerenders; disposed views cannot overwrite the active page.

## Validation and remaining work

`npm run galaxy:check`, `npm run typecheck`, `npm test`, `npm run build`. The review execution and actual browser/publication receipt live in [the research execution plan](plans/ecosystem-research-v2.md), following the [initial galaxy review](plans/ecosystem-galaxy.md).

Remaining data work: newer HF snapshots, source-confirmed directed lineage, actual code/model bridges, verified organization identity and stable multi-period layouts. No synthetic temporal playback or invented real-time events are included. Website expansion and rendering are independently implemented; data reuse does not create new upstream licensing rights.
