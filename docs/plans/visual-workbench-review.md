# Visual workbench upgrade — private review

- Execution state: active
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
| Source, data and brand invariants | Diff + deterministic suite | Pending |
| App compile/build | typecheck + build | Pending |
| Desktop / narrow / bilingual / themes | Browser review + CI suites | Pending |
| Core interactions and changed defaults | Browser checks | Pending |
| Private review delivery | PR + private site | Pending |

## Decisions and progress

- Clean isolated worktree created from the current upstream snapshot. Existing data collection workflow is unchanged; PR builds cannot run the production deploy job.
- Global defaults may change for this review; the original comprehensive preset remains a supported interaction fixture. Simulation is retained as an explicit presentation mode.

## Resume / follow-up

Implement the first visual pass, inspect in the managed preview, resolve observed defects, and record concrete test/CI/deployment results here before handing off for maintainer review.
