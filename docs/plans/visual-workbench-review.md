# Compact observatory — paired-theme release 1.5.2

- Execution state: completed; PR #37 merged and production Pages verified
- Baseline: `6cb118b6896c044b0cdd510f7a09ee869ba8b998`
- Branch: `design/observatory-review-v2`; PR https://github.com/X-lab2017/open-dipper/pull/37
- Current scope: preserve original structure and information, coordinate both themes, reduce the header logo and publish through GitHub Pages after validation. Earlier private-review restrictions below are historical and superseded by the release authorization.
- Responsible collaborator: Codex, AI-assisted engineering and design.

## Acceptance

1. Preserve the original three columns and equal sidebars, top toolbar and perspective control. No additional title row or enlarged default spacing.
2. Default to the comprehensive five-layer map and benchmark inspector. Preserve all eighteen layers, encodings, catalogs, sources, geography, brands and original data values.
3. Show five totals, scope counters, the entire top ten, latest news and ecosystem pulse together at 1280×720, 1366×768, 1440×900, 1920×1080 and 1920×1200. Check clipping ancestors as well as page overflow.
4. Keep layer display management directly available. The pulse remains mounted with four metrics, seven platforms, event stream and five controls. Preserve simulation labels and original pause/step/map-link behavior.
5. Preserve Map/Globe/Wire, themes, Chinese/English, one/two-screen modes, mobile natural flow, keyboard and reduced motion. Retain the hidden-canvas resize guard and camera round-trip regression.
6. Publish the validated paired-theme build through GitHub Pages under the maintainer’s 2026-10-27 release instruction. Preserve historical baseline fingerprints.

## Implementation

Restore original Atlas composition and defaults; retain centralized CSS loading, paired quieter surfaces, tabular values and keyboard focus. Replace the broad spacing overrides with a small visual refinement stylesheet. Radar and Galaxy keep their original layout and behavior. No data refresh or dependency addition.

Hallmark reference from the earlier review informed paired-theme and type considerations. It does not justify removing content or changing the established composition. No external theme/code/assets are imported.

## Verification

- Local typecheck, full deterministic suite, build and diff checks passed.
- Browser visual review confirmed the restored composition in dark Chinese and light English, plus intact Radar/Galaxy layouts and module return.
- Full successful CI: https://github.com/X-lab2017/open-dipper/actions/runs/40413141051 at `8bef12a1c795d56d313e1426a5bd3233eced1859`. Atlas, workspace, clipping-aware 20-case desktop density matrix, four mobile theme/language cases, portal/radar/galaxy, panorama and analysis browser suites passed. Pages deployment was skipped.
- The regression checks all ten ranking rows, five totals, scope counts, pulse metrics/platforms/controls, latest news and clipping ancestors. Ordinary layer trees and the original display stack retain their supported internal scrolling.
- The first added-test failure counted only mounted tree checkboxes; collapsed groups intentionally unmount theirs. The corrected assertion verifies all five active inspector labels independently of tree expansion. No product behavior was changed to satisfy that assertion.
- Application changes: `3336b7b5c3f8e0d17ee30dcc895ba6320a854b27`; the CI successor only corrects the regression assertion.
- Private review was completed before public-release authorization. Public source commits and CI evidence above preserve the reproducible engineering record; private hosting identifiers are omitted.

## Superseded candidate

The earlier single-layer default, large title, uneven columns, tall ranking rows and collapsed display/pulse sections were rejected during maintainer review. Their technical CI success was not visual acceptance. The earlier application commit was `53c46569b705db1b842b5e7d6394f4763c61001e`; it is historical evidence only, not the current contract.

## Delivery boundary

Private review: https://opendipper-workbench-review-20261026.token4all.chatgpt.site

The private-review boundary was superseded by the maintainer’s 2026-10-27 instruction to refine both themes and publish Pages. Physical touch devices and a complete assistive-technology audit are outside the recorded checks.

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
- Private review was completed before public-release authorization. Public source commits and CI evidence above preserve the reproducible engineering record; private hosting identifiers are omitted.

## Paired-theme publication (2026-10-27)

The maintainer accepted the compact structure and authorized publication after visual refinement. Application 1.5.2 and visual system 1.4.0 retain all original routes, text, data, controls and row budgets.

- Use ink-blue surfaces and brighter cyan/teal data marks in dark mode; cool-white surfaces and deeper ink/cyan in light mode. Shared token roles coordinate maps, Radar, Galaxy, source badges and interaction states.
- Reduce the product wordmark from 176px to 148px on desktop (130px on mobile), and the X-lab mark to 52px (44px on mobile). Preserve official SVG bytes and aspect ratios.
- Use surface brightness and crisp rim borders for dark elevation, small shadows for light overlays, quiet active-navigation fills, explicit focus/selection and more distinct chart ramps. Add only short colour transitions; reduced-motion remains supported.
- No component tree, data adapter or event handling is changed in this follow-up. The current main-branch bot snapshot is retained through a merge; no incidental data refresh is requested.
- Reference: Hallmark’s restyle, dark-mode and data-viz guidance, adapted to the existing dashboard contract. This is not a full Hallmark lint certification.

Measured local browser review at 1363×936 retains the exact original budgets: topbar 64px, context row 48px, summary 62px, map container 797×599px, pulse 104px; five totals, ten ranks, four pulse metrics, seven platforms and five controls remain present. Shared-text contrast is tested on page, panel, input, raised and selected surfaces in both themes; focus is tested at 3:1. Final test/CI/deployment results belong to the PR’s delivery record, not an assumed pass here.

Local typecheck, the full deterministic suite (124 Node tests and 6 Python tests), design/docs generation checks, production build and diff checks passed. The Galaxy palette regression now verifies the full shared palette remains unchanged by visual effects, rather than pinning two obsolete colour literals; vivid-mark checks remain intact. The final browser matrices passed before merge (see delivery below).

## Verified public delivery

[PR #37](https://github.com/X-lab2017/open-dipper/pull/37) merged as `c8b2c76b58f3874fb1fd52d44664def7f7f14999`. [Production CI / Pages 40423706809](https://github.com/X-lab2017/open-dipper/actions/runs/40423706809) passed and deployed at 2026-10-27 08:05:06 Asia/Shanghai. No release step remains. The benchmark-default acceptance above is historical; [1.6.0](../releases/1.6.0.md) now opens Active developers.
