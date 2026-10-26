# AI radar finishing review

State: implemented, verified and published on 2026-10-26, authorized by the maintainer. The maintainer accepted the dense 1.3.1 radar and asked for theme checks, less repeated text, useful operation guidance and alignment with the observatory before the next module.

## Scope

- Preserve the accepted 160-entity, numbered circular radar, bilingual brand assets and fact/demo separation.
- Reuse observatory column widths and shared segmented controls; improve theme-specific target/selection contrast and legibility.
- Keep one usage guide and one catalog-level sources entry; remove repeated footer guidance, duplicate task descriptions and the sidebar sales link. Keep evidence and official material actionable at candidate level.
- Explain hover/select/sector focus in place, keyboard/compare/export/local watch behavior in the guide; keep catalog sources reachable on mobile.
- Fix expanded-radar state across selection and sector changes; synchronize focused sectors with the inspector, restore focus on return, and pause decorative animation in hidden documents.

## Verification

Required: typecheck, full deterministic tests, build, managed-browser light/dark radar plus map/globe, CI browser regression including expanded selection, sector Escape, preview action, mobile sources, pause and other routes. Preserve bot snapshots and publish through PR then Pages; record receipts in issue #26.

## Local evidence

Typecheck, complete deterministic suite and production build passed. Managed preview confirmed the enlarged radar stays open after choosing a target, underlying navigation is inert, and both themes use the retained bilingual assets. Category label and target-number colors pass 4.5:1 contrast in both token themes. CI browser acceptance and deployment both passed; receipts are recorded below and in issue #26.


## Publication receipt

- [PR #29](https://github.com/X-lab2017/open-dipper/pull/29) merged as `6544f48ccaab9a43a7c56069c487f620ec83723e` (application 1.3.2).
- [PR CI 40275718242](https://github.com/X-lab2017/open-dipper/actions/runs/40275718242) and [production CI / Pages 40275957548](https://github.com/X-lab2017/open-dipper/actions/runs/40275957548) passed their build and browser suites; Pages deployment succeeded.
- The public `#radar` route was reloaded and checked on 2026-10-26: 80 targets, one guide, one catalog sources entry, expanded selection retained and explicit return working. Managed-preview visual review covered light/dark radar and map/globe; the two radar captures are archived in [the radar contract](../AI_RADAR.md).
- Scope remains visual and interaction polish. The sourced 160-entity catalog, fixed illustrative advice and bilingual brand artwork were retained. Automated evidence refresh, independent assessments and the next product module remain separate work.
- Codex implemented the maintainer-authorized changes, ran local checks, inspected the managed browser and recorded the actual CI / deployment receipts. Follow-up product review stays in [issue #26](https://github.com/X-lab2017/open-dipper/issues/26).
