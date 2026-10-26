# Open Galaxy public release — incremental delivery

- Execution state: **active**.
- Baseline: recovered application **1.5.0** source snapshot `799f04a15b5670b786fdba0e063e12df8ab10e7c`; accepted public map/radar baseline **1.3.2**. Integration must preserve the current public branch's later changes and data refreshes.
- Last meaningful update: 2026-10-26.
- Responsible collaborator: Codex, AI-assisted source recovery, scoped UI refinement, documentation and verification.
- Implementation PR, landed commit and production run: not yet recorded; publication is not verified by this document.

## Outcome and acceptance

Publish the reviewed Open Galaxy research experience to the existing OpenDipper GitHub Pages site after strengthening the visual effects in **both dark and light themes**. Visitors should retain the complete journey: discover a project, understand recorded relationships, compare a small shortlist and take away an evidence report. Global observation and AI radar remain available and unchanged in scope.

1. Brighter, more legible galaxy colors and motion in both themes, without presenting decorative activity as measurement.
2. Motion controls and reduced-motion preferences remain effective; keyboard, mobile and expanded-view return paths remain usable.
3. Existing task discovery, search, selection, relationships, shortlist and report generation survive the visual change. Markdown, HTML and JSON downloads must be verified separately from content-generation tests.
4. Both README editions retain **three distinct module screenshots and explanations**: global observation, AI radar and Open Galaxy. Historical previews carry their own dates; none is represented as a current production screenshot.
5. Publish incrementally from the current public branch, retain concurrent data/documentation changes, and verify the exact resulting commit's required CI and Pages deployment.

## Context and boundaries

Read [the galaxy contract](../OPEN_GALAXY.md), [research review evidence](ecosystem-research-v2.md), [accepted design baseline](../../design/baselines/observatory-radar-1.3.2.md), [data contracts](../DATA_CONTRACTS.md), [operations](../OPERATIONS.md) and [current status](../STATUS.md).

- Retain all source nodes, fingerprints, observation windows and source identifiers. Do not recollect or fabricate data for this visual release.
- Recorded model relations remain distinct from inferred relations, which default off. Do not invent cross-network bridges, lineage direction or real-time event motion.
- Unknown evidence remains missing, not zero. Metric comparisons retain source, entity type and period; sampled values are not global totals.
- Preserve map/globe/wire, AI radar, bilingual content, one/two-screen layout, local-only state and the established contribution/harness documentation.
- Public Pages validation does not require signing into the protected review Site. Protected-site login has not been authorized or performed for this release.
- This plan does not claim that the recovered source includes any uncommitted work from the interrupted execution. The interruption's underlying cause remains unconfirmed.

## Steps and checkpoints

1. Recover the exact review source and check its source/version provenance; inspect repository instructions and pending changes.
2. Apply isolated galaxy visual refinements; review both themes, interaction states and reduced-motion behavior.
3. Restore the global-observation illustration alongside radar and galaxy in both READMEs. Keep their participation, contribution, architecture and transparency sections intact.
4. Reconcile the incremental product changes with the latest public branch, preserving newer snapshots and unrelated edits. Recheck the remote head immediately before writing; use normal fast-forward/concurrency-safe writes, never force-push `main`.
5. Run the required deterministic checks and production build; exercise the browser suite at the repository subpath, including report downloads and navigation back to the other modules.
6. Record the final diff, commit/PR, exact CI result and Pages receipt. Update status language only after corresponding evidence exists.

## Decisions and progress

- 2026-10-26: Restored separate global-observation, AI-radar and Open-Galaxy sections in the English and Chinese READMEs. Each retains a dated implementation-preview caption and a module contract link.
- The retained global-observation image is the 2026-10-25 overview preview; the radar image is the 1.3.2 light-mode preview from 2026-10-26; the galaxy image is the 1.5.0 research preview from 2026-10-26. New validated captures may replace the corresponding image without removing another module.
- This recovery must not overwrite the current public branch wholesale with the older review snapshot. The publication owner is responsible for resolving the integration against the live remote head.

## Verification and delivery

| Criterion | Command or inspection | Actual result | Evidence / pending work |
| --- | --- | --- | --- |
| Recovered source identity | Source HEAD and package version | Recovered snapshot is `799f04a15b5670b786fdba0e063e12df8ab10e7c`, application 1.5.0 | Recheck final integration provenance before publication |
| README three-module retention | English/Chinese content and image-path inspection; `npm run docs:check` | Passed on 2026-10-26: three dated module sections, local links and translation structure | Context: 3 generated files; docs: 68 Markdown files, 482 local inline links, 14 task recipes, 6 language editions; recheck after final edits |
| Type safety | `npm run typecheck` | Passed on 2026-10-26 | Final 1.5.1 integrated source |
| Deterministic regression suite | `npm test` | Passed on 2026-10-26 | Data, document, atlas, radar and 17 galaxy checks passed |
| Production bundle | `npm run build` | Passed on 2026-10-26 | Relative Vite base; graph and prior module assets present |
| Visual and interaction acceptance | Dark/light, reduced motion, mobile, search, selection, return/navigation | Not run for final release | Review screenshot evidence and browser output |
| Report file receipt | Markdown, HTML and JSON download tests | Not run for final release | Earlier review only confirmed JSON receipt; do not infer other downloads passed |
| Public-branch reconciliation | Final diff and latest remote HEAD | Integrated from `b7647de4fd38cef3229bbd3b182767ea2c6f6a20` | Current event/monthly/geography snapshots, contribution docs, workflow and accepted baseline unchanged; remote will be rechecked at push/merge |
| CI and Pages | Exact landed commit, required checks and deployment | Pending | Do not equate a saved review version or old CI run with this release |

## Resume / follow-up

The publication owner should finish the visual changes, record actual validation here, reconcile against the current public branch and publish only the verified incremental result. After deployment succeeds, add the commit/PR and CI/Pages links, check the public `#ecosystem` entry and the other two module routes, then update the README's release-in-progress caption and the authoritative status. Retain any remaining physical-device, export or production verification limits explicitly.

### Execution-environment boundary

Local Chromium browser checks could not start: the Playwright browser download returned an invalid archive, and installed Chromium was blocked by the execution sandbox IPC socket restriction. The requested environment escalation itself failed during sandbox setup; no protected account login was attempted. The existing GitHub browser CI remains a required release gate. The browser test now saves and reads all three downloaded reports, asserts their identity and source observation periods, and retains them with dark/light/mobile screenshots in the existing browser-QA artifact. It also checks actual moving, paused and live-reduced-motion canvas frames.

### First PR browser run and correction

[Run 40323570918](https://github.com/X-lab2017/open-dipper/actions/runs/40323570918), head `6aa9943b3d52cb0cf77fa7c6a28701433ad9bda8`, passed deterministic checks, build, map/radar browser regressions and actual motion controls, then failed on the first galaxy result click. The search input emits `change` on blur before the result click; the overbroad change handler rebuilt the pointer target and lost the click. The handler now limits changes to its owned filter controls, while search remains handled by its existing input debounce. The unchanged real mouse-click acceptance now also checks that search-change preserves the result DOM identity, repeated selection and module return. Export receipt was not reached in this failed run.
