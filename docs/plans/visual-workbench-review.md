# Compact observatory — private review revision

- Execution state: Hallmark-informed compact restyle deployed privately; awaiting maintainer review
- Baseline: `6cb118b6896c044b0cdd510f7a09ee869ba8b998`
- Branch: `design/observatory-review-v2`; draft PR https://github.com/X-lab2017/open-dipper/pull/37
- Scope: preserve original structure and information while refining visual details. Update the existing private review Site; do not merge or deploy GitHub Pages.
- Responsible collaborator: Codex, AI-assisted engineering and design.

## Acceptance

1. Preserve the original three columns and equal sidebars, top toolbar and perspective control. No additional title row or enlarged default spacing.
2. Default to the comprehensive five-layer map and benchmark inspector. Preserve all eighteen layers, encodings, catalogs, sources, geography, brands and original data values.
3. Show five totals, scope counters, the entire top ten, latest news and ecosystem pulse together at 1280×720, 1366×768, 1440×900, 1920×1080 and 1920×1200. Check clipping ancestors as well as page overflow.
4. Keep layer display management directly available. The pulse remains mounted with four metrics, seven platforms, event stream and five controls. Preserve simulation labels and original pause/step/map-link behavior.
5. Preserve Map/Globe/Wire, themes, Chinese/English, one/two-screen modes, mobile natural flow, keyboard and reduced motion. Retain the hidden-canvas resize guard and camera round-trip regression.
6. Deliver the revised build at the same owner-private Site. Accepted baselines and public Pages remain unchanged.

## Implementation

Restore original Atlas composition and defaults; retain centralized CSS loading, paired quieter surfaces, tabular values and keyboard focus. Replace the broad spacing overrides with a small visual refinement stylesheet. Radar and Galaxy keep their original layout and behavior. No data refresh or dependency addition.

Hallmark reference from the earlier review informed paired-theme and type considerations. It does not justify removing content or changing the established composition. No external theme/code/assets are imported.

## Verification

- Local typecheck, full deterministic suite, build and diff checks passed.
- Browser visual review confirmed the restored composition in dark Chinese and light English, plus intact Radar/Galaxy layouts and module return.
- Full successful CI: https://github.com/X-lab2017/open-dipper/actions/runs/40413141051 at `8bef12a1c795d56d313e1426a5bd3233eced1859`. Atlas, workspace, clipping-aware 20-case desktop density matrix, four mobile theme/language cases, portal/radar/galaxy, panorama and analysis browser suites passed. Pages deployment was skipped.
- The regression checks all ten ranking rows, five totals, scope counts, pulse metrics/platforms/controls, latest news and clipping ancestors. Ordinary layer trees and the original display stack retain their supported internal scrolling.
- The first added-test failure counted only mounted tree checkboxes; collapsed groups intentionally unmount theirs. The corrected assertion verifies all five active inspector labels independently of tree expansion. No product behavior was changed to satisfy that assertion.
- Application changes: `3336b7b5c3f8e0d17ee30dcc895ba6320a854b27`; the CI successor only corrects the regression assertion. Private Site source `41a0bccbad160548548ecc02e50fee3c3b875991` contains the same application asset bytes.
- Owner-private deployment succeeded on 2026-10-27 at 06:34:31 Asia/Shanghai. Review packaging only adds noindex/nofollow and omits Pages CNAME. Source data, official brands and accepted baseline fingerprints remain unchanged.

## Superseded candidate

The earlier single-layer default, large title, uneven columns, tall ranking rows and collapsed display/pulse sections were rejected during maintainer review. Their technical CI success was not visual acceptance. The earlier application commit was `53c46569b705db1b842b5e7d6394f4763c61001e`; it is historical evidence only, not the current contract.

## Delivery boundary

Private review: https://opendipper-workbench-review-20261026.token4all.chatgpt.site

Apply further feedback on this branch and update this Site. Do not merge, accept a new baseline or deploy Pages without a subsequent release instruction. Physical touch devices and a complete assistive-technology audit are outside the recorded checks.

## Follow-up: system restyle within the compact composition

The maintainer accepted the restored composition and authorized a systematic visual refinement while retaining structure and information. Starting point: `3c2e7b11750fda34cb391dbb323574b2206e0bd2`. Preserve the six acceptance constraints above.

Apply Hallmark v2's app-screen/restyle ideas to the existing brand: a small type hierarchy, body-face labels, tabular figures, restrained surfaces, lighter separators, aligned numeric columns, distinct selection/focus states and paired themes. All original markup, text, values, actions and module layouts stay in place; no new title row or collapsed content. Refine the shared shell, Atlas tree/summary/inspector/pulse/news, Radar/Galaxy text and controls, and evidence dialogs.

Sources consulted 2026-10-27: Nutlope/hallmark README and `skills/hallmark/references/{flow,redesign,craft,fonts,data-viz,dark-mode}.md`. This adapts principles, not a new theme or runtime dependency; the existing project checks and managed browser provide verification. No claim of a complete Hallmark lint pass.

Files: edit `design/tokens.json`, `src/design/workbench.css`, one obsolete mobile font-size override in `src/presentation-v7.css`, generated token mirrors, docs and visual-version assertion. Production TypeScript, data snapshots, routes and official assets are unchanged.

Verification for this follow-up:

- Local `npm run typecheck`, `npm test`, `npm run build` and `git diff --check` passed. Token generation and published design-package checks passed; there is no dependency or data refresh.
- Managed browser review covered Chinese/dark and English/light Atlas plus Radar and Galaxy. At 1363×936, the topbar (64px), context row (48px), summary (62px), map canvas container (797×599px), pulse (104px) and right sidebar (260px) exactly match the pre-restyle measurements.
- The clipping regression now includes main figures, rank values and simulation qualifiers. Initial CI detected English DEMO GROWTH overflowing at 1280×720; a language-scoped label adjustment fixes this without removing the qualifier or changing the row budget. The final application commit includes the correction.
- Full successful CI: https://github.com/X-lab2017/open-dipper/actions/runs/40419170720 at `9d4f82e63e8cd939f9d47e2f646f9b9a1d1afe39`. The 20-case desktop matrix, four mobile cases and all Atlas/workspace/portal/Radar/Galaxy/panorama/analysis browser suites passed. Pages deployment was skipped. Application commit: `673569add2e5be848d758fdc34b389e4b19ec393`; private Site package source: `2783b14a4dcb47afffad31774c50b4838dce6c16`.

- The CI successor changes only PR concurrency: a newer check supersedes older checks for the same PR; production remains serialized. The older runner was stuck installing Chromium, so its obsolete check was cancelled and the complete latest check ran successfully. No test or publication gate was removed.
- Owner-private Site deployment succeeded at 2026-10-27 07:24:20 Asia/Shanghai, deployment `appgdep_6adfe1150b348191923f04d96a14ce8d`. Site source `2783b14a4dcb47afffad31774c50b4838dce6c16` contains application `673569add2e5be848d758fdc34b389e4b19ec393`; the CI successor has identical application sources. The cloud review entry retains its ChatGPT sign-in gate; visual QA uses the same application build locally and in CI.
