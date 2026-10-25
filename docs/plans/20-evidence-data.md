# Focused observed data — issue #20

- State: active
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

Implementation and source extraction complete. Local typecheck, 66 deterministic checks, build and documentation checks passed. Managed preview confirms the four facts, independent periods, metric switching and keyboard-selectable supply values; screenshots retained in docs/assets. Four Chromium suites and Pages remain pending in CI; deployment evidence belongs in issue #20. Do not treat this plan as evidence of successful deployment.

AI-assisted scope: data-source verification, bounded adapter, client validation/UI, tests, documentation and screenshot records. No new dependencies, brand token changes, event approval changes, source repository mutations or paid-service claims.
