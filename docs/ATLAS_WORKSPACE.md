# Atlas workspace contract

Production entry: `src/atlas.ts`. This supersedes the older runtime UI described in `OBSERVATION_WORKSPACE.md`; existing generated evidence and observation contracts remain inputs. The previous controller remains in source for traceability, not as the primary route. Historical analysis and panorama routes retain their own entry points.

## Observation model

| Group | Layer | Geometry and selection |
| --- | --- | --- |
| Developers | Active developers; contribution; high-impact talent | Area, zero or one within group |
| Organizations | Companies; foundations; universities/research | Circular entity points, additive |
| Projects | Influence; benchmark; emerging; large-model projects | Influence is an area; other three are additive entity points |
| Assets | Code; models; datasets; content | Proportional-area regional bubbles, zero or one within group |
| Infrastructure | Energy; compute | Circular entity points, additive |
| Ecosystem | News/events; conferences | Circular entity points, additive |

Only one area fill is visible at a time. Other selected area layers retain tabs and can become primary. One asset bubble layer and multiple entity layers can overlay it. Closing a layer tab deselects its layer; entity tabs retain independent details. Project rankings preserve original report rows including unlocated entries. Missing regional values show no bubble; absence is not zero. Global totals do not change with local selection, and independent measures are never summed into a meaningless combined total.

`src/layers.ts` owns selection, presets and points. `src/rankings.ts` owns rankings. `src/dashboard.ts` separates exact totals from synthetic growth; `pulse-model.ts` has deterministic rolling windows. `src/observatory/scene.ts` renders both views with shared scales and camera geometry.

## Data and evidence

- `dashboard-overview.json`: captured OpenShare GOSD totals, source timestamp and verification date, preserved source metadata/hash. 246 source regions differs from regional map coverage.
- `active-developers.json`, `report-layers.json`: report tables/figures and independent periods, imported with `scripts/import-*.py`.
- `repo-ranking.json`: September 2026 monthly repository leaderboard; never treated as regional code totals.
- `located-entities.json`: evidence-backed location subset; headquarters/registration/publisher attribution is not training or deployment location. Unlocated original rankings stay in the catalog.
- Energy records are historical WRI samples, not a current operating inventory or evidence of AI power supply. Compute locations use official facilities. All per-entity evidence remains available.
- Sourced `events.json` is still collected by the existing workflow. Pulse growth and pulse location associations are synthetic, separate from events, rankings and overview. 2026 Git projection is unverified scenario input. `arXiv` is research activity, not a code hosting platform.
- China entity scope includes Taiwan. Source statistical codes and values remain intact; display grouping does not automatically add source records or manufacture missing totals.

## Presentation and operation

Default map is north-up at 5° E / approximately 42° N. Its Mercator framing balances the 83° N–56° S inhabited-land extent vertically, with equal top/bottom margins and width/height fit constraints. Initial view, reset and Home share `MAP_HOME`; resizing preserves geographic center. Map fullscreen has a persistent return control and Escape. Reduced motion disables automatic animation; invisible views pause rendering. Globe instrument sweep and hover outline are decorative, never additional measurements.

Dark/light tokens, ramps and layer tones are maintained in `design/tokens.json`; run `npm run design:build`. See [visual system](VISUAL_SYSTEM.md). Validation: `npm run test:atlas`, `npm run test:observatory:ui`, `npm run test:portal:ui`, and legacy suites listed in [development](DEVELOPMENT.md). CI performs browser tests at the GitHub Pages subpath.


## Runtime loading and current reliability limit

`start()` currently loads twelve atlas snapshots together. A failed request or JSON parse leads to the full-page retry state; earlier optional-snapshot loaders are not the production entry. The five-minute event check retains existing data on failure but does not provide a complete refresh-error state. [DATA_CONTRACTS.md](DATA_CONTRACTS.md) lists the exact boundary; [#10](https://github.com/X-lab2017/open-dipper/issues/10) tracks validation and recovery. The radar has independent validated catalog/demo loaders after global startup. This documentation records the implementation, not a completed reliability improvement.

## Compact observatory and World tour (1.6.0)

The accepted three-column composition keeps five summary values, scope counters, ten ranking rows, latest news and the ecosystem pulse visible together on desktop. The default inspector opens **Active developers**; the five layer tabs are **Active developers → Companies → Benchmark projects → Model assets → Conferences & events**. Compute facilities and the other layers remain available in the tree. One 16px SVG geometry slot is shared by the key, tree, stack, legend and inspector: area cells, proportional bubble, located-entity point. Group icons distinguish people, organizations, projects, assets, infrastructure and signals.

**World tour / 环球巡航** is an explicit footer action. It visits those five panels once at ten-second intervals: world map → North American company headquarters → East Asian project organizations → worldwide model bubbles → a sourced conference host city. Globe stops use existing located-entity anchors; camera stops are presentation choices, not additional evidence. The inspector keeps global scope and original periods. Only the current stop's non-area layer is highlighted; other default panels remain available. Previous/next, direct stop selection, pause/resume and exit are keyboard-accessible. Exit or Escape restores the previous camera, layers, selected region/entity and view. Manual interaction, hidden-page state and reduced-motion changes pause autoplay. Reduced motion starts in manual mode; navigation and page exit cancel timers. On mobile, the tour also exposes the inspector below the map, with a panel jump control.

The pulse retains four counters, seven platforms, its event stream and five controls, with explicit simulation labels. Source snapshots, dates and observation periods are unchanged. A hidden-map resize guard preserves a finite camera during mobile tab switches. Navigation now calls the ecosystem module **开源星系 / Open Galaxy**; its `#ecosystem` route and content remain intact.

Historical accepted baseline fingerprints are unchanged. See [execution and validation](plans/observatory-tour.md); the paired visual system introduced by [PR #37](https://github.com/X-lab2017/open-dipper/pull/37) is retained.
