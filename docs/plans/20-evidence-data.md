# Focused observed data — issue #20

- State: completed
- Task: https://github.com/X-lab2017/open-dipper/issues/20
- Goal: useful, restrained real content from OpenShare, GOSD and the existing OpenDigger lens.

## Scope and acceptance

1. Four compact, source-linked overview facts, replacing sample/demo event headline counts.
2. One global map with three distinct measures: developer stock, developer OpenRank contribution and project OpenRank influence. Retain organization and demo layers.
3. One AI supply chart, models/datasets switch, explicit monthly window and evidence. Keep project analysis unchanged.
4. Optional validated snapshot, deterministic offline adapter, retained source extracts, provenance and attribution. Missing values remain missing; no fictional fallback.
5. English/Chinese, keyboard/mobile, single/two-screen and existing scene interaction remain usable. Run typecheck, tests, build, browser checks and verify published Pages.

## Decisions and checkpoints

- OpenShare: three public `selfoss.open-digger.cn/openshare/overview/` boards. Global developer trend is labelled 2025. Country boards have no observation period; retrieval is not a period. Coverage: 224 / 236 / 30 rows, not one shared denominator.
- GOSD: observed `supply-observation.json` at commit `c51e3441361407b68f10b339d97eff288319b503`; totals 2026-10-16, monthly observations through 2026-07; latest month completeness unknown. Exclude scenario/demo CSVs and organization-subset geography.
- Natural Earth pinned map-label anchors, no inferred headquarters. AU duplicate components resolved to ADM0_A3=AUS; unmatched regions stay in the list without map nodes.
- This source snapshot does not complete monthly geography contract issue #9, paid services or real-time AI analysis.

## Verification and handoff

Implementation and source extraction complete. Local typecheck, 66 deterministic checks, build and documentation checks passed. Managed preview confirms the four facts, independent periods, metric switching and keyboard-selectable supply values; screenshots retained in docs/assets. Implementation [3d75239](https://github.com/X-lab2017/open-dipper/commit/3d75239f569e2e43ecb2843a6ee1118be986c08d) passed all four Chromium suites and Pages deployment in [run 40167099362](https://github.com/X-lab2017/open-dipper/actions/runs/40167099362). The published site was checked for overview facts, default global layer, contribution coverage, dataset chart values and pinned source links. Published screenshots replace the preview images. Final archive verification and any follow-up run are linked in issue #20.

AI-assisted scope: data-source verification, bounded adapter, client validation/UI, tests, documentation and screenshot records. No new dependencies, brand token changes, event approval changes, source repository mutations or paid-service claims.
