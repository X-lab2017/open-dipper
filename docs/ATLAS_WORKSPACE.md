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

Default map is north-up at 10° E / 36° N, balancing US and China in an Atlantic-spanning frame. Initial view, reset and Home share `MAP_HOME`; resizing preserves geographic center. Map fullscreen has a persistent return control and Escape. Reduced motion disables automatic animation; invisible views pause rendering. Globe instrument sweep and hover outline are decorative, never additional measurements.

Dark/light tokens, ramps and layer tones are maintained in `design/tokens.json`; run `npm run design:build`. See [visual system](VISUAL_SYSTEM.md). Validation: `npm run test:atlas`, `npm run test:observatory:ui`, `npm run test:portal:ui`, and legacy suites listed in [development](DEVELOPMENT.md). CI performs browser tests at the GitHub Pages subpath.


## Runtime loading and current reliability limit

`start()` currently loads twelve atlas snapshots together. A failed request or JSON parse leads to the full-page retry state; earlier optional-snapshot loaders are not the production entry. The five-minute event check retains existing data on failure but does not provide a complete refresh-error state. [DATA_CONTRACTS.md](DATA_CONTRACTS.md) lists the exact boundary; [#10](https://github.com/X-lab2017/open-dipper/issues/10) tracks validation and recovery. The radar has independent validated catalog/demo loaders after global startup. This documentation records the implementation, not a completed reliability improvement.
