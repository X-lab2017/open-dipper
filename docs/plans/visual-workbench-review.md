# Visual workbench upgrade — private review

- Execution state: completed (private review delivery; maintainer acceptance pending)
- Baseline: `6cb118b6896c044b0cdd510f7a09ee869ba8b998`
- Branch: `design/observatory-review-v2`
- Authorization: implement a systematic interface/visualization upgrade and provide an isolated review; do not merge or deploy GitHub Pages.
- Responsible collaborator: Codex, AI-assisted engineering and design.

## Outcome and acceptance

Make the existing observatory easier to read and operate, with a coherent visual system across Atlas, AI Radar and Open Galaxy. Preserve their different spatial visualizations, official brands, evidence, languages and themes.

1. Atlas opens on a focused participation map with matching inspector, visible legend and readable time/scope. Existing comprehensive and role presets remain selectable.
2. Primary controls, labels and results have deliberate hierarchy. Advanced layer presentation and simulated activity are explicit disclosures; closing simulation stops its map pulses.
3. Selecting a region shows its active regional measure; global benchmark rankings retain their stated global scope.
4. Map/globe, layer combinations, all catalogs, entity details, news/events, radar discovery/comparison and galaxy research/export remain available.
5. Both themes, Chinese/English, desktop one/two-screen, narrow layouts, keyboard and reduced motion are checked. Observations, unknowns and source clocks are not recalculated by styling.
6. Deliver a branch/PR, verification evidence and a private review URL. Production Pages and accepted historical baselines stay untouched.

## Design direction and references

Professional spatial workbench: a continuous visualization, quieter tool surfaces, legible type and one clear selection hierarchy. Adapt Hallmark v2's app-screen, typography, paired-theme and data-viz principles to OpenDipper's existing brand and map/galaxy requirements. This is an independent implementation, not an imported theme, new runtime dependency or claim of passing Hallmark's entire lint suite.

Reference: https://github.com/Nutlope/hallmark (README, SKILL, references/flow.md, data-viz.md, dark-mode.md and redesign.md; consulted 2026-10-26). No third-party code, fonts, photographs or visual assets copied.

## Scope and implementation checkpoints

- Shared type/surface/shape tokens and a production-only workbench stylesheet.
- Atlas composition, progressive layer controls, explicit simulation disclosure, source clock labels and region/inspector continuity.
- Radar and Galaxy control, list, panel and text refinement, retaining their visualization engines and discovery/research logic.
- Contract/visual documentation and meaningful regression coverage for changed defaults and disclosures.
- Typecheck, deterministic suite, build, browser review, PR CI and isolated private deployment.

## Verification and delivery

| Criterion | Check | Result |
| --- | --- | --- |
| Source, data and brand invariants | Diff + deterministic suite | Passed; snapshots, official brands, workflow and baseline fingerprints unchanged |
| App compile/build | typecheck + build | Passed locally and in CI with Node 24 |
| Desktop / narrow / bilingual / themes | Browser review + CI suites | Passed; desktop, 1024px tablet, 390px mobile; Chinese/English and both themes |
| Core interactions and changed defaults | Browser checks | Passed; defaults, keyboard disclosures, simulation disposal, region continuity, all existing module suites and compatibility routes |
| Private review delivery | PR + private site | Draft PR #37; owner-private deployment succeeded; Pages deploy skipped |

## Decisions and progress

- Clean isolated worktree created from the current upstream snapshot. Existing data collection workflow is unchanged; PR builds cannot run the production deploy job.
- Global defaults may change for this review; the original comprehensive preset remains a supported interaction fixture. Simulation is retained as an explicit presentation mode.

## Resume / follow-up

Await maintainer visual review. Apply feedback on this branch and update the same private Site. Do not merge, accept a new baseline or deploy GitHub Pages without a subsequent release instruction.

## Delivered evidence

- Draft review: https://github.com/X-lab2017/open-dipper/pull/37
- Application commit: `74cf06fb61b913028f65a6b350ecb182ef65531d`.
- Full successful CI: https://github.com/X-lab2017/open-dipper/actions/runs/40405128447 — typecheck, deterministic checks, build, Atlas/workspace/workbench, portal/radar/galaxy, panorama and analysis browser suites all passed. The Pages deploy job was skipped.
- QA artifact: `browser-qa-83dddfa25ece1e3988c25f178dce9e18fab1c4ad` (7-day GitHub retention). Includes the 12-case Atlas theme/language/width matrix and existing module/export evidence.
- Private review: https://opendipper-workbench-review-20261026.token4all.chatgpt.site — owner-only deployment succeeded on 2026-10-26. Browser access correctly shows the ChatGPT sign-in gate when signed out.
- Private Site source commit: `74be3bc13a813d1868f3e83b097024a2d742aa93`, generated from the application commit above. Its asset bytes match the validated build; review packaging only adds noindex and omits Pages CNAME.
- Local checks: `npm run typecheck`, `npm test`, `npm run build`, `git diff --check` passed. No data refresh, dependency addition, brand replacement or production workflow edit.
- Visual QA corrected compressed rank rows, old mobile title overrides and unnecessary topbar wrapping. The first CI failure was an ambiguous test locator after adding a second source entry; the test now targets the primary control explicitly.

Limitations: physical touch devices and a complete assistive-technology audit are not covered. This private review serves a fixed build/snapshot; the existing scheduled collector continues independently on the production repository. Maintainer design acceptance and public release remain pending.
