# AI radar finishing review

State: implementation and release verification in progress, authorized 2026-10-26. The maintainer accepted the dense 1.3.1 radar and asked for theme checks, less repeated text, useful operation guidance and alignment with the observatory before the next module.

## Scope

- Preserve the accepted 160-entity, numbered circular radar, bilingual brand assets and fact/demo separation.
- Reuse observatory column widths and shared segmented controls; improve theme-specific target/selection contrast and legibility.
- Keep one usage guide and one catalog-level sources entry; remove repeated footer guidance, duplicate task descriptions and the sidebar sales link. Keep evidence and official material actionable at candidate level.
- Explain hover/select/sector focus in place, keyboard/compare/export/local watch behavior in the guide; keep catalog sources reachable on mobile.
- Fix expanded-radar state across selection and sector changes; synchronize focused sectors with the inspector, restore focus on return, and pause decorative animation in hidden documents.

## Verification

Required: typecheck, full deterministic tests, build, managed-browser light/dark radar plus map/globe, CI browser regression including expanded selection, sector Escape, preview action, mobile sources, pause and other routes. Preserve bot snapshots and publish through PR then Pages; record receipts in issue #26.

## Local evidence

Typecheck, complete deterministic suite and production build passed. Managed preview confirmed the enlarged radar stays open after choosing a target, underlying navigation is inert, and both themes use the retained bilingual assets. Category label and target-number colors pass 4.5:1 contrast in both token themes. CI browser acceptance and deployment will be linked in issue #26.
