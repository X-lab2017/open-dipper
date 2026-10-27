# Focused intelligence reader · 1.11.0

2026-10-27 · AI-assisted implementation at the maintainer's request.

## Scope

Make Intelligence solely a compact three-pane reader. Remove visual exploration, duplicate second-screen stream, task rail, sample/service blocks and Agent composer from this surface. Retain all actual source records, source/type filters, optional advanced filters, saved/read state, previous/next, source attribution and mobile list/reader navigation. Fixed fictional records remain in research demonstrations, not the reader. Agent/question creation belongs to Research, which can explicitly import saved sources.

Folo is an interaction reference, not an embedded dependency. Inspected its dev README and package.json: the root is a private monorepo with web/desktop build tooling and AGPL-3.0-only metadata. No documented drop-in reader component was established in these sources. This change imports no upstream source/assets, adopts no new repository license, and does not connect Folo accounts/APIs. A true source-level integration requires a separate adapter/runtime/license plan; current Pages work remains original.

## Acceptance and progress

- Read compactly, search/filter without changing source semantics, retain bookmarks across reload, read the entire archive through incremental list loading.
- Mobile opens a dedicated reading pane with a back button; desktop fills one viewport. Preserve both languages/themes and first three modules.
- Run typecheck/full tests/build and focused CI browser regressions. Record actual publishing evidence in the PR.
- Implemented the focused reader, archive list loading, mobile list/reader switch and research-side saved-source import.
- Local typecheck, full tests and production build passed; browser inspection verified paired themes, one-viewport fit and saved-source import. PR CI and deployment pending.
