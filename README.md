# OpenDipper · 开源生态观测站

An independent, evidence-first observatory for open-source ecosystems. First review prototype, powered by a bundled **real monthly OpenDigger sample snapshot**, not a live feed.

## Review scope

- 20 curated repositories: 17 GitHub, one each GitLab, Gitee and AtomGit. Not global coverage or a representative sample.
- Six monthly metrics: OpenRank, activity, participants, contributors, new stars, accepted change requests.
- Platform and month filters, repository search, within-platform sample rankings.
- Up to three repository trends, 6/12/24 consecutive calendar-month windows; missing months remain gaps.
- Source evidence drawer: raw CDN link, selected period, latest metric period, entity meta update, retrieval time, status and raw-response SHA-256.
- Chinese/English interface, persistent light/dark theme, responsive styles and keyboard-accessible controls.
- No copied/forked WorldMonitor code; the original seven-star visual identity is drawn in SVG. No invented geography or collaboration network.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Open the local URL Vite prints. The application does not call external APIs at runtime. External evidence links open only when selected.

```sh
npm run typecheck
npm test
npm run build
npm run preview -- --host 127.0.0.1
```

The production output is `dist/`. It uses relative asset paths for static hosting, including a future repository subpath. GitHub Pages deployment is managed by `.github/workflows/pages.yml`; publishing is complete only after the deployment job succeeds.

### Browser checks

With a local development server on port 4173 and Chromium installed:

```sh
npm run dev -- --host 127.0.0.1 --port 4173
# another terminal
CHROMIUM_PATH=/path/to/chromium npm run test:ui
```

The browser script covers filtering, comparison limits, missing/404 data, nested GitLab names, themes, language, evidence dismissal, mobile overflow and failure states. It writes screenshots to `screenshots/`. See [actual validation status](docs/PROGRESS.md): browser execution is currently blocked in the build environment, so **visual/mobile rendering has not yet been verified**. DOM tests are not a substitute for browser layout verification.

## Data and refresh

The included snapshot was fetched on 2026-10-24 UTC. Read [the data contract](public/data/README.md) for sources, selection, metric definitions, freshness differences, HTTP states, and provenance limitations.

```sh
npm run refresh:data
npm run test:data
```

Refresh performs bounded public read-only requests. It requires network access to `oss.open-digger.cn`; it is not run by the browser or scheduled automatically. Review the diff and freshness before using new data.

## Interpretation boundaries

Observation month, per-metric latest month, entity metadata timestamp and retrieval timestamp are separate. Zero is displayed only when the source actually reports zero. Missing data does not establish inactivity, abandonment, a platform outage, or a quality judgment. Cross-platform charts are contextual comparisons, not an assertion of equal coverage or semantics. Rankings are only within each selected platform's curated sample.

OpenRank is an influence signal, **not a quality, security or investment score**. The raw-response checksum cannot reconstruct source contents; full raw responses are not archived in this package and CDN links may change.

## Third-party attribution

Runtime library notices are preserved in [THIRD_PARTY_NOTICES.txt](public/THIRD_PARTY_NOTICES.txt), included in the deployed build. Natural Earth source attribution and OpenDigger provenance are recorded in the data documentation. These notices do not select a license for OpenDipper.

## License

License pending maintainer decision. No open-source license is asserted for this independent code yet. OpenDigger's code license does not automatically license all upstream or platform data. Source-data redistribution terms remain an unresolved review item; public availability does not itself grant a reuse license.

## Progress

See [PROGRESS.md](docs/PROGRESS.md) for the factual build and validation record, and [REVIEW.md](docs/REVIEW.md) for a short walkthrough.

## 0.2 panoramic experience

The homepage is now a full-viewport interactive globe / map, with actual Natural Earth boundaries and real public OpenDigger geographic contribution layers. Drag or use arrows, zoom with the wheel or controls, switch map/globe, select country markers and change label layers. Monthly playback controls **repository metrics only**; annual geography is a static, explicitly scoped layer.

The previous analysis UI is preserved at `analysis.html` and opens from “深度分析 / Analysis”. The homepage uses d3-geo for robust spherical clipping, not inferred geographic links. Geographic markers represent map-label anchors, not personal coordinates or repository locations. Read `public/data/GEOGRAPHY.md` and source metadata for scope and attribution.

`npm test` now runs data, legacy analysis DOM, geography and panorama scene/DOM suites. These are deterministic behavioral checks, not browser visual verification. License selection remains pending; dependency licenses and Natural Earth public-domain attribution remain distinct from source-data reuse permissions.

## GitHub Pages

The workflow validates type safety, all four deterministic test suites, a production build, and Chromium smoke tests for both panorama and analysis at the repository subpath before uploading only `dist/`. Browser screenshots are retained for seven days as separate QA artifacts. Pull requests run checks without deployment. Pushes to `main` and manual runs on `main` deploy through GitHub Pages after repository Settings → Pages is configured with **GitHub Actions** as its source. No custom domain or CNAME is set.

The `./` Vite base, relative analysis link and bundled data URLs support hosting below `/open-dipper/`. The published URL is provided by the successful deployment job; no live deployment is claimed by this README alone. The snapshot is bundled and is not refreshed by CI.
