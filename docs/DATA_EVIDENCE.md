# OpenShare and GOSD observed evidence

Scope: [issue #20](https://github.com/X-lab2017/open-dipper/issues/20), [execution plan](plans/20-evidence-data.md). This is a small, source-pinned addition to the existing OpenDigger project lens, not a claim of exhaustive or real-time coverage.

## Product selection

The initial four overview facts answer “how large is the observed ecosystem?” One map switches developer stock, developer contribution and project influence. One AI radar chart switches monthly model/dataset additions. Existing OpenDigger project rankings answer project-level changes. Do not add more summary cards merely because more fields exist upstream.

| Measure | Source | Observation clock | Scope |
| --- | --- | --- | --- |
| 180,145,424 developers | OpenShare `developers.json`, explicit Global Total Developers trend | 2025 label | Published global total, not a sum of organization samples |
| Developer stock map | Same response, Latest Total Developers by Country board | Not disclosed | 224 rows; 217 map anchors |
| Developer contribution map | `contribution.json`, Developer OpenRank Contribution by Country | Not disclosed | 236 rows; 226 map anchors; OpenRank score, not people |
| Project influence map | `influence.json`, Open Source Project OpenRank Influence by Country | Not disclosed | 30 rows, all anchored; not exhaustive worldwide coverage |
| 3,158,803 model repositories / 1,093,040 datasets | GOSD / OpenGauge, Hugging Face public platform observations | 2026-10-16 | Platform counts; not deduplicated models, active users, quality or license-qualified open source |
| Monthly model/dataset additions | Same GOSD observed snapshot | 2022-03–2026-07; chart shows last 12 calendar months | Latest-month completeness unpublished; no growth conclusion from the last bar |

OpenShare API root: `https://selfoss.open-digger.cn/openshare/overview/`. Public entry: https://open-share.cn/insight/open-world/gosd. Country board periods must not inherit the global trend's year, retrieval date, or another report capture. The source does not disclose cross-platform deduplication; developer counts are not asserted to be unique natural persons. Country sums may differ from the explicit global total; do not invent an unknown remainder. Each metric has its own coverage and denominator. Unlisted values are missing, never zero.

GOSD source: [supply-observation.json](https://github.com/X-lab2017/2026-Global-Open-Source-Development-Report/blob/c51e3441361407b68f10b339d97eff288319b503/preview/content/gosm/supply-observation.json), [methods](https://github.com/X-lab2017/2026-Global-Open-Source-Development-Report/blob/c51e3441361407b68f10b339d97eff288319b503/preview/content/gosm/supply-methods.md). Report commit `c51e3441361407b68f10b339d97eff288319b503`; original report retrieval 2026-10-17. Only the explicitly observed snapshot is used. Scenario CSVs, report demo data, company rankings, spaces/papers are deliberately excluded from this initial evidence adapter. Publisher-subset geography is now handled separately by [the observation workspace](OBSERVATION_WORKSPACE.md), with its own missing-value and clock contract.

## Versioned data path

- `data/reference/openshare-{developers,contribution,influence}.json`: selected original board and global trend, source URL, retrieval timestamp, HTTP status and SHA-256 of the **full original response bytes**. Other boards and `change` comparisons are not presented; their comparison windows are unknown.
- `data/reference/gosd-supply.json`: source commit, Git blob SHA, original metadata and fingerprints, model/dataset summaries and monthly observations. GOSD source URL metadata is retained for attribution, not called by the browser.
- `config/country-anchors.json`: ISO2-to-ISO3 map-label anchors extracted from the same pinned Natural Earth 50m file as the existing geography. The only duplicate ISO2, AU, selects ADM0_A3=AUS (Australia), excluding IOA and ATC components. Unmatched codes retain null coordinates. These are map labels, never inferred personal or headquarters locations.
- `scripts/build-evidence.mjs`: offline deterministic adapter; no network, extrapolation or silent fallback.
- `public/data/evidence.json`: generated, versioned output. `extracts` holds SHA-256 hashes of the **retained extract/config files**, separately from original-response hashes.
- `evidence.ts`: bounded atomic client validation, optional loader, map adaptation and calendar window. `evidence-view.ts` / `evidence.css`: bilingual source details, overview strip and accessible chart, using existing visual tokens.

Schema version 1 retains `observedPeriod: null`, `unknownRegionTotal: null`, separate source clocks, per-metric rows and nullable monthly values. Missing calendar months become gaps in the chart; a real zero remains zero. The earlier optional loader shows unavailable data without replacing the original map. Production `src/atlas.ts` now loads this snapshot as a required startup input; a failed request/parse leads to the global retry state. See [current loading boundaries](DATA_CONTRACTS.md). It never falls back to demos. TWN display remains Taiwan, China / 中国台湾 without numeric redistribution.

## Rebuild, refresh and validation

```sh
npm run evidence:build
npm run evidence:check
npm run typecheck
npm test
npm run build
```

The committed extracts are sufficient for offline rebuilds. `evidence:check` verifies exact generated bytes and tests provenance boundaries, source clocks, country counts, gaps, zero, rejection and failure behavior. Browser coverage evolves with the production entry. Current observatory/portal suites cover atlas composition and navigation; the earlier optional-source failure scenario is not proof of current startup recovery. See [development](DEVELOPMENT.md).

Refresh is **manual and reviewed**, not added to the half-hour event scheduler:

1. Fetch the three exact public API URLs above with bounded response sizes/timeouts. Record successful UTC retrieval and full-response SHA-256. Retain the named board and global trend; compare board titles, identifiers and units before replacing extracts.
2. For GOSD, resolve and record an immutable commit, file path and Git blob SHA. Verify `meta.dataStatus=observed` and `containsSimulatedData=false`; retain `meta`, source fingerprints and the two summaries/monthly series. Do not overwrite with a scenario file. The `source` object names the report commit/path; original retrieval stays in `meta`.
3. If any source is unavailable or its contract changed, retain the last successful extract and record the failure in the issue. Stage changes for review; do not edit totals or dates to make checks pass.
4. Run the offline builder and all relevant checks, inspect changes in coverage/times, then publish through normal CI. Update this table and browser value assertions when intentionally accepting a new snapshot. Ordinary UI work must not refresh sources incidentally.

Future refresh automation, published country periods/unknown denominators and complete current monthly series need a separate, source-backed contract. This snapshot does not close [monthly geography #9](https://github.com/X-lab2017/open-dipper/issues/9).

## Attribution and reuse

OpenShare / OpenDigger: source values, names, original URLs and hashes retained; no blanket relicensing of upstream platform data. GOSD / X-lab2017 / OpenGauge: [report license CC BY 4.0](https://github.com/X-lab2017/2026-Global-Open-Source-Development-Report/blob/c51e3441361407b68f10b339d97eff288319b503/LICENSE); OpenDipper extracts selected observations and redraws its own charts. Natural Earth geometry/anchors are public domain; pinned provenance is retained. See [rights](RIGHTS.md) for the separate application and brand boundaries.

## Version record

Captured from the published site on 2026-10-25: [overview](https://raw.githubusercontent.com/X-lab2017/open-dipper/ae3da3e0fa00a3ef7167b8d26a3196d7c1fdd0bc/docs/assets/opendipper-observed-overview-2026-10-25.jpg) and [AI supply chart](https://raw.githubusercontent.com/X-lab2017/open-dipper/ae3da3e0fa00a3ef7167b8d26a3196d7c1fdd0bc/docs/assets/opendipper-observed-supply-2026-10-25.jpg). These record the UI and independent source clocks, not live values. The existing portal screenshot remains a historical artifact. Deployment and browser verification are recorded in issue #20.
