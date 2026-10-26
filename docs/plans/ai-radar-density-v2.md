# AI radar density and legibility revision

State: active, authorized 2026-10-26 after the first public review. The maintainer wants the repository bilingual logo restored, stronger radar contours/targets/text, and substantially more real entities using existing Landscape/GOSD sources.

## Scope and acceptance

- Restore the existing brand 1.1 bilingual horizontal SVG in the shared header; keep upstream artwork untouched.
- Expand to 80 software and 80 model/data candidates using source-backed identifiers and observations. Preserve original 30 rows and unknown periods/versions.
- Recompose the first screen around a larger, high-contrast three-ring radar. Numbered circular targets map to a readable candidate list; all lens candidates render, with no arbitrary 18-point cap.
- Support sector focus, target inspection, comparison, search and keyboard access without moving filtered points. Preserve dark/light, mobile, reduced motion, guides and demo off.
- Keep sourced facts and fixed simulated judgments separate. No new paid or live evaluation service.

## Work and evidence

Root owns interface, geometry, integration, tests and publication. A bounded research agent extends the factual source extract only. Required gates: typecheck, full deterministic tests/build, managed-browser visual inspection, CI browser acceptance, Pages deployment. Actual receipts will be recorded in issue #26.

## Data and implementation record

- Exactly 160 real candidate identities, 44 source records; original 30 identities/observations preserved. Added 68 Landscape software rows, 39 GOSD report models, 9 official HF models and 14 official HF datasets. Unknown download windows/revisions remain null.
- Existing bilingual brand 1.1 restored; no logo artwork regenerated. Application 1.3.1 keeps atlas/visual baseline intact.
- Full-lens rendering, stable numbering, separated circular targets, sector zoom, linked hover/focus preview and pausable decorative scan implemented.

## Verification progress

Local `npm run typecheck`, complete `npm test`, `npm run build`, and `git diff --check` passed. Managed-browser checks confirmed 80 targets per lens, Chinese bilingual header, both themes, 20-target sector focus, return and selected entity details. CI browser and Pages receipts are pending publication and must be recorded separately in issue #26.
