# Accepted baseline: Observatory + AI radar 1.3.2

Accepted by the maintainer and recorded **2026-10-26**. Application **1.3.2**, visual tokens **1.3.0**, product identity **1.1.0**. This record extends the [earlier atlas baseline](atlas-1.3.0.md) without rewriting it.

- Implementation: [6544f48](https://github.com/X-lab2017/open-dipper/commit/6544f48ccaab9a43a7c56069c487f620ec83723e), [PR #29](https://github.com/X-lab2017/open-dipper/pull/29).
- Verification: [PR CI](https://github.com/X-lab2017/open-dipper/actions/runs/40275718242) and [production CI / Pages](https://github.com/X-lab2017/open-dipper/actions/runs/40275957548) passed. Published radar selection/return was checked on 2026-10-26. [Release receipt](https://github.com/X-lab2017/open-dipper/commit/f255f7ee21f5d65365573fd2b0a5eff05229e6c8).
- Reproduction: [source fingerprint manifest](observatory-radar-1.3.2.json). Hashes belong to the pinned implementation, not today's main. Checkout that commit in a separate worktree to reproduce its UI; scheduled event snapshots retain independent clocks.
- Accepted behavior: [atlas contract](../../docs/ATLAS_WORKSPACE.md), [AI radar contract and theme captures](../../docs/AI_RADAR.md), [shared visual specification](../../docs/VISUAL_SYSTEM.md).

## Reusable decisions

| Concern | Baseline behavior | Why it matters |
| --- | --- | --- |
| Navigation | Retain five primary modules, bilingual product logo, language/theme, one/two screens and GitHub | Module changes preserve orientation |
| Composition | Dominant canvas, matching side columns, compact context row, one focused tabbed inspector | Discovery and details remain readable on a presentation screen |
| Shared controls | Semantic tokens, `.od-segmented`, consistent selected/focus/disabled states | Map/globe and radar/list feel like the same product |
| Visual encoding | Geographic area color, asset bubble area, circular entity marks; radar has equal numbered discs | Shape/size have explicit meanings; catalog numbers and radar angle are not ranks |
| Guidance | One usage guide, one catalog source entry, short in-place operation cues | Guidance is discoverable without filling the canvas with repeated prose |
| Selection | Hover/focus previews, click inspects, sectors filter the candidate and detail together | A visible choice has a predictable result |
| Expanded view | Selection preserves the overlay; explicit return and Escape; background inert; focus restored | Users can inspect without losing context or getting trapped |
| Access and motion | Paired light/dark contrast, keyboard/touch alternatives, natural mobile flow, pause/reduced-motion/hidden-tab handling | Presentation effects support the task |
| Evidence | Facts, fixed simulated judgments and unknowns are separate; original scope and dates remain accessible | A polished demo cannot imply an unmeasured result |

The radar contains 80 software candidates and 80 model/data candidates (60 models + 20 datasets). These are sourced identities with uneven evidence coverage; ring positions and advice remain fixed simulated judgments, not reviewed adoption recommendations. The map's full-coverage aggregates, samples and simulated entities must likewise retain their original scopes.

## Apply to the next module

1. Read current status and the relevant contract, not all completed plans. Copy the [module worksheet](../../docs/templates/OBSERVATORY_MODULE.md) into a scoped proposal.
2. Name the user's decision and useful output. Reuse the shell and controls; choose a visualization suited to that question rather than copying a radar everywhere.
3. Specify source/fixture/missing states, default view, selection, return path and meaningful next action. Show only filters the data supports.
4. Reuse existing tokens and brand assets. Add no new theme system or logo variant. Generated mirrors come from their builders.
5. Verify both themes/languages, desktop and phone, keyboard, reduced motion, failed/empty data and expanded-view return. Use the relevant checks in the development guide and record actual results.

## Portable assets and limits

`npm run design:package` keeps the existing download URL and includes this record/manifest as `BASELINE.md` / `BASELINE.json`, the historical atlas record, shared visual assets, `AI_RADAR.md` and `MODULE_TEMPLATE.md`. Source-relative links are resolved in the repository. The ZIP is a resource package, not a runnable full application.

No live model evaluation, evidence refresh service, cloud accounts, payment or subscription delivery is included. Rights remain separate; see [RIGHTS.md](../../docs/RIGHTS.md). Community onboarding and cleanup are tracked in [#30](https://github.com/X-lab2017/open-dipper/issues/30).
