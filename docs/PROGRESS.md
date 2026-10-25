# v1 architecture review · 2026-10-25

- Rebuilt the main product around map, globe and event wire views, preserving the prior panorama and analysis routes.
- Added typed contracts, configurable adapters, release/RSS collectors, reviewed editorial intake and separate demo fixtures.
- Added 30-minute event / monthly OpenDigger schedules, snapshot archival, last-good retention and source health.
- Added event/filter/provenance tests and new-product browser acceptance including draft generation and mobile overflow.
- Local typecheck, build and deterministic suites pass. Deployment and browser acceptance must be confirmed by the associated GitHub Actions run; this file does not claim deployment before that result.

---

# OpenDipper build record

Build history for review prototypes 0.1.0 and 0.2.0. Earlier sections describe the scope at their recorded time.

## Completed

- **14:04 UTC** — Independent Vite/TypeScript scaffold created; relative production base path. No upstream application code copied or forked.
- **14:06 UTC** — Actual monthly OpenDigger snapshot collected for 20 fixed curated repositories. Six metrics each: 115 valid series, four empty series, one HTTP 404. These are sample observations, not platform totals.
- **14:08 UTC** — Overview, comparison and evidence views implemented with original seven-star SVG identity, theme and language controls, filtering, repository search and source drawer.
- **14:08–14:11 UTC** — Data-integrity review corrections: comparison uses consecutive calendar months; platform changes reconcile selected projects; provenance explains that hashes refer to full raw CDN responses before normalization, not normalized snapshot.json.
- **14:12 UTC** — Final TypeScript check, data tests, DOM interaction tests and production build passed.

## Actual test results

| Command / check | Result | Scope |
|---|---|---|
| `npm run typecheck` | PASS | Strict TypeScript, no emit |
| `npm run test:data` | PASS, 11/11 | Month parsing, zero/missing distinction, calendar window, interpolation marker, value validation, identity, HTTP states, same-platform ranking, sample size, provenance |
| `npm run test:dom` | PASS, 7/7 | Real snapshot rows; comparison cap; platform selection reconciliation; nested GitLab identity; 404/missing drawer; Escape; historical consecutive-month axis; empty search; definitions/language/theme; fetch-error screen |
| `npm test` | PASS | Runs the data and DOM suites only, not browser QA |
| `npm run build` | PASS | TypeScript + Vite production output in `dist/` |
| `npm run test:ui` | BLOCKED AT BROWSER STARTUP | Chromium could not create required sockets in the restricted execution environment. No browser assertions ran. |
| Alternate supported browser preview | UNREACHABLE | Preview browser could not reach the local development or static preview server. No visual acceptance or screenshots produced. |

## Pending acceptance

- Real-browser desktop and mobile visual review, layout/overflow, keyboard focus and complete interaction checks. The Playwright test script is included and can be run in a compatible local environment.
- No screenshots are included because no browser-rendered screenshot was successfully captured. DOM tests do not validate visual layout.
- Maintainer review of sample selection, naming, product structure and code license.
- Separate review of data redistribution rights before formal publication or mirroring.

## Not performed

At version 0.1: no code push, deployment, live monitoring, user tracking, geography layer or collaboration-network visualization. No claim of production readiness. No external runtime API dependencies beyond intentional source links.

## Reproduction

See the root README for install/run/test commands and `docs/REVIEW.md` for a review checklist. Use the bundled lockfile with `npm ci`. Data retrieval is reproducible using `npm run refresh:data`, but upstream files may change.

## 0.2 panoramic redesign — 2026-10-24 14:33 UTC

- Replaced the analysis-first landing page with a full-screen globe/map observatory. Original analysis remains available in a separate embedded workspace.
- Real Natural Earth geographic outlines, standard d3-geo spherical clipping, drag/keyboard rotation, zoom, auto-rotation, planar map panning and layer visibility controls implemented.
- Three actual OpenDigger geographic label snapshots: Microsoft, Apache and PyTorch Foundation. Markers are map-label anchors, never people, headquarters or inferred inter-region flows. Static annual geography is explicitly independent of monthly repository playback.
- All four geographic integrity tests and eight panorama scene/DOM tests added to the aggregate npm test command.
- Panorama tests verify real layer boot, finite projection coordinates through multiple orientations/poles, map pan and globe return, zoom/reset, country selection, independent timeline, reduced motion, overlay closure, empty geometry and empty layers.
- Browser visual QA remains unavailable in this execution environment. A projected scene SVG was generated for inspection preparation, but available image tooling lacked its SVG rasterization delegate; no screenshot or pixel-level acceptance is claimed.
- GitHub publication is prepared separately; successful deployment must be verified before declaring the site live.

## GitHub Pages preparation — 2026-10-24 14:40 UTC

- Clean dependency installation, TypeScript check, all 30 deterministic tests (11 data, 7 analysis DOM, 4 geography, 8 panorama), and production build passed.
- Added minimal-permission GitHub Actions deployment, with production-browser acceptance at the repository subpath before any Pages upload. Chromium smoke covers both panorama and analysis; screenshots are short-lived QA artifacts, not application assets.
- Browser acceptance on the hosted runner and public deployment are pending repository availability. No successful workflow or live site is claimed yet.
- Publication includes only source, lockfile, build configuration, documentation and explicitly bundled public aggregates/basemap. No raw source-response archives, credentials, internal work files, dependency folders or QA images are included.
