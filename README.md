# OpenDipper · 全球开源生态观测站

Monthly OpenDigger intelligence and near-live ecosystem events in one geographic workspace.

**Review site:** https://www.x-lab.info/open-dipper/

Version 1 rebuilds the observatory around the **map / globe / wire** product pattern, informed by World Monitor's interaction layout. The implementation is independent; no World Monitor source code or branding is copied.

## Product

- Global map and interactive globe, choropleth, metric markers, located event markers, layer switches, drag/zoom/keyboard control and focus mode.
- Event wire: releases, security/supply chain, governance, policy, community and research. Filter by category, text, publication window, region and priority; inspect original evidence.
- Monthly repository rankings within one platform and period, twelve-calendar-month trends, month playback and local watchlists.
- Real data and demo scenarios are independently stored, identified and switchable. Unknown location remains unlocated; no repository headquarters or collaboration links are inferred.
- Chinese/English, dark/light, responsive layout, accessible controls and source freshness information.
- Manual event editor: local draft, JSON export and a prepared GitHub issue submission. Maintainers publish through review; no client API tokens.

## Reusable visual baseline

**[Visual system 1.0](https://www.x-lab.info/open-dipper/design-system.html)** applies the official X-lab AI mark, green/blue identity and a charcoal workspace to OpenDipper. Shared tokens drive both CSS and Canvas, with light/dark variants, three metric palettes, six event categories, source badges and persisted density.

- Usage and design decisions: [`docs/VISUAL_SYSTEM.md`](docs/VISUAL_SYSTEM.md)
- Maintained tokens: [`design/tokens.json`](design/tokens.json)
- Reusable primitives: [`src/design/components.css`](src/design/components.css)
- Run `npm run design:build` after editing tokens; `npm run build` produces a downloadable visual resource bundle.
- Official logo provenance and upstream rights are preserved under `public/brand/`. WorldMonitor design patterns are independently implemented; its source code is not included.

## Connected data

| Channel | Initial scope | Refresh |
| --- | --- | --- |
| OpenDigger repository metrics | 20 curated repositories, 4 platforms, 6 metrics | Monthly; day 8 at 02:07 UTC, or manual workflow input |
| OpenDigger geography | Microsoft, Apache, PyTorch Foundation labels | Monthly retrieval of independent trailing-year snapshots |
| GitHub releases | Kubernetes, PyTorch, vLLM, VS Code, Rust, DuckDB | Scheduled every 30 minutes |
| Official RSS | OpenSSF, CNCF | Scheduled every 30 minutes |
| Editorial events | Open, currently approved GitHub issues | Scheduled every 30 minutes |
| Demonstration | 13 fictional located scenarios, synthetic geographic metrics | Fixed fixture; never rebased by the collector |

These are **sample scopes, not worldwide population totals**. Full-coverage data is the next integration step. Activity, OpenRank and accepted change requests are distinct measurements; accepted PRs are an explicit contribution-volume proxy, not a universal contribution score. Missing observations are never zero-filled. Trailing-year geography does not change with the repository month slider.

Schedule times are targets, not a real-time SLA. GitHub Actions can delay runs, and public repositories' schedules may be disabled after prolonged inactivity. The page displays actual snapshot and source success timestamps. The browser checks deployed event snapshots every five minutes.

## Development

Node.js 22+ / npm and Python 3 (standard library only for collectors).

```sh
npm ci
npm run dev
npm test
npm run build
```

`dist/` is the static artifact. Relative assets support the `/open-dipper/` path. The detailed metric workbench is retained at `analysis.html`; the previous globe is archived at `panorama.html`.

```sh
npm run refresh:events
npm run refresh:monthly
python3 scripts/fetch-geography.py
```

`config/sources.json` controls event adapters. `config/repositories.json` controls the OpenDigger catalog. Do not schedule `generate-demo.py`: fixed demo dates intentionally expire out of time filters.

## Ingestion and publishing

`.github/workflows/pages.yml` collects sources, validates data/code, builds and deploys. Validated snapshots are archived in Git on the same run before deployment. A bot-created data commit does not retrigger the workflow. A concurrent external write rejects the normal Git push rather than overwriting it. Pull requests validate without collecting, writing snapshots or deploying.

Every non-scheduled deployment runs Chromium acceptance for the observatory, archived panorama and detailed analysis at the repository subpath. Scheduled runs reuse accepted code and run deterministic checks and the production build. QA screenshots are retained as workflow artifacts for seven days.

### Editorial events

1. Use **录入生态事件 / Submit an event**, or the issue template.
2. Verify source, time, category and location. No reliable location means `null`.
3. Apply `event-approved` after review. A maintainer can create that label on first use.
4. The next collection publishes it. Edits or comments after approval invalidate it; remove and reapply the label to reapprove. Label timestamps are checked; unconfirmed approval fails closed.
5. Close the issue or remove the label to retract it. During an outage the last successful feed remains marked stale until successful reconciliation.

Records are data, never executable code. The browser does not post issues automatically. `GITHUB_TOKEN` is used only inside Actions and only for the fixed GitHub API origin.

## Architecture

See [architecture](docs/ARCHITECTURE.md), [review walkthrough](docs/REVIEW.md), [event contract](docs/EVENTS.md), [monthly contract](public/data/README.md), [geography semantics](public/data/GEOGRAPHY.md), and [progress](docs/PROGRESS.md).

## Attribution

OpenDigger provides source metrics. Natural Earth provides public-domain geometry. Existing dependency notices remain in [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt). Source-data terms and the application's own license remain distinct; this update does not select a new project license.
