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
- The retained global-observation image is the 2026-10-25 overview preview; the radar image is the 1.3.2 light-mode preview from 2026-10-26. The initially recovered 1.5.0 galaxy preview remains in the historical research record; the README now uses the verified 1.5.1 light CI capture without removing another module.
- This recovery must not overwrite the current public branch wholesale with the older review snapshot. The publication owner is responsible for resolving the integration against the live remote head.

## Verification and delivery

| Criterion | Command or inspection | Actual result | Evidence / pending work |
| --- | --- | --- | --- |
| Recovered source identity | Source HEAD and package version | Recovered snapshot is `799f04a15b5670b786fdba0e063e12df8ab10e7c`, application 1.5.0 | Recheck final integration provenance before publication |
| README three-module retention | English/Chinese content and image-path inspection; `npm run docs:check` | Passed on 2026-10-26: three dated module sections, local links and translation structure | Context: 3 generated files; docs: 68 Markdown files, 492 local inline links, 14 task recipes, 6 language editions; recheck after final edits |
| Type safety | `npm run typecheck` | Passed on 2026-10-26 | Final 1.5.1 integrated source |
| Deterministic regression suite | `npm test` | Passed on 2026-10-26 | Data, document, atlas, radar and 17 galaxy checks passed |
| Production bundle | `npm run build` | Passed on 2026-10-26 | Relative Vite base; graph and prior module assets present |
| Visual and interaction acceptance | Dark/light, reduced motion, mobile, search, selection, return/navigation | Passed in CI 40327243123 on product head `ae0883a1` | Screenshots below; physical devices not tested |
| Report file receipt | Markdown, HTML and JSON download/save/read tests | All three passed in CI 40327243123 | Files inspected from browser-QA artifact; sizes and SHA-256 below |
| Public-branch reconciliation | Final diff and latest remote HEAD | Integrated from `b7647de4fd38cef3229bbd3b182767ea2c6f6a20` | Current event/monthly/geography snapshots, contribution docs, workflow and accepted baseline unchanged; remote will be rechecked at push/merge |
| CI and Pages | Exact landed commit, required checks and deployment | Product head passed CI 40327243123; final documentation head is independently gated | Final merge/deployment receipt is recorded on PR #33 after the corresponding checks; no production claim from preview assets |

## Resume / follow-up

Product implementation and browser acceptance are recorded below. The final documentation-only head must pass its own CI, then the publication owner will recheck main/PR head, merge normally, monitor the exact production run, and check the public `#ecosystem` entry and the other two module routes. Record the resulting merge/CI/Pages links and public checks in PR #33; no screenshot or acceptance claim implies an unobserved deployment. Physical-device and PDF-printing limits remain explicit.

### Execution-environment boundary

Local Chromium browser checks could not start: the Playwright browser download returned an invalid archive, and installed Chromium was blocked by the execution sandbox IPC socket restriction. The requested environment escalation itself failed during sandbox setup; no protected account login was attempted. The existing GitHub browser CI remains a required release gate. The browser test now saves and reads all three downloaded reports, asserts their identity and source observation periods, and retains them with dark/light/mobile screenshots in the existing browser-QA artifact. It also checks actual moving, paused and live-reduced-motion canvas frames.

### First PR browser run and correction

[Run 40323570918](https://github.com/X-lab2017/open-dipper/actions/runs/40323570918), head `6aa9943b3d52cb0cf77fa7c6a28701433ad9bda8`, passed deterministic checks, build, map/radar browser regressions and actual motion controls, then failed on the first galaxy result click. The search input emits `change` on blur before the result click; the overbroad change handler rebuilt the pointer target and lost the click. The handler now limits changes to its owned filter controls, while search remains handled by its existing input debounce. The unchanged real mouse-click acceptance now also checks that search-change preserves the result DOM identity, repeated selection and module return. Export receipt was not reached in this failed run.

### Second PR browser run and renderer-state synchronization

[Run 40324810321](https://github.com/X-lab2017/open-dipper/actions/runs/40324810321), head `cfbf9633a9b14ca3ee09c54a833ef431a21e1eb4`, finished browser installation successfully but failed a motion-frame equality assertion before selection. The PNG assertion exceeded the log-line limit, so the retained log cannot distinguish the pause and live-reduced assertions; no export receipt is claimed. The renderer now exposes its applied motion state for explicit synchronization. The browser waits for that state and queued base frames, then compares four frame hashes over 540 ms, preserving the static-frame requirement and readable failure diagnostics. A JSON motion-evidence artifact records each observation. This does not alter animation behavior or bypass a failed check; the new exact head must pass the full browser suite.

## Verified 1.5.1 browser receipt

- Product head: `ae0883a1cccf1ffbd6c3a4945467a18500cb45f9`; tree `a223c6e682987b69043129855304aee1b820ae04`. [CI 40327243123](https://github.com/X-lab2017/open-dipper/actions/runs/40327243123) completed successfully on 2026-10-26: full deterministic checks, production build, repository-subpath browser acceptance for atlas/radar/galaxy/panorama/analysis.
- [Browser artifact 12651721664](https://github.com/X-lab2017/open-dipper/actions/runs/40327243123/artifacts/12651721664): 26 files, 12,700,166 bytes; archive SHA-256 `69ef74f4614a3be9f1c579432a5bf03f6c4593d3edc671846a487ea783af6cdb`. CI artifacts have seven-day retention; the three galaxy screenshots are preserved below.
- Search blur preserves the pointer target; real repeated clicks select PyTorch. Recorded PyTorch–vLLM path, shortlist, report opening and three-format downloads passed. Expansion/Escape, inference toggle, tour stop, English/mobile view and returning through radar/map passed with no page errors.
- Running effects changed actual pixels. Paused and live-reduced states each produced four identical complete-canvas hashes over 540 ms: `848bfbf0eecaec9c56a47bbfc91ef7c58d93adda01d74719125788da4eb3b302`.
- Source clocks stay distinct: code window 2025.08–2026.07; model snapshot 2026-08-05; report generation time is not an observation clock. Inferred links remain excluded by default. Missing/sample limitations remain explicit.
- These captures are CI evidence, not production or physical-device screenshots. PDF printing and real touch devices remain untested. Protected Site account login was not attempted.

### Preserved captures

[Dark overview](../assets/opendipper-galaxy-1.5.1-dark-overview-20261026.png) · [Light research workspace](../assets/opendipper-galaxy-1.5.1-light-research-20261026.png) · [Mobile layout](../assets/opendipper-galaxy-1.5.1-mobile-20261026.png). README editions retain the earlier separate map and radar captures and now use the 1.5.1 light workspace.

### Actual downloaded report files

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `pytorch-report.html` | 18110 | `d75c5263d699e049876d89c7eff198e2fd1fea63d1db3484dd72b6ee3b6702ea` |
| `pytorch-report.json` | 10049 | `fab5acd9a8e8fab0e049ed4618b29f74cade5bf00fc9fb98eaca15760f57be04` |
| `pytorch-report.md` | 5992 | `60eba81cda508aded4604955ef3f2861f4fe97fd01366c95c8df487d6ae62db3` |

All three were received from real browser download events, saved and read back; they identify `pytorch/pytorch` and retain the code observation window. HTML is self-contained; JSON preserves structured sources; Markdown retains the report sections. Final merge and Pages production evidence is appended to [PR #33](https://github.com/X-lab2017/open-dipper/pull/33) after the corresponding exact-head checks, avoiding a self-referential source-commit receipt.
