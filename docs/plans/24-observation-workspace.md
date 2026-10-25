# Execution plan: observation workspace delivery

- State: active
- Issue: #24; implementation extends PR #23 and the #22 design.
- Baseline: 2544ba7 (design); production 50a3c4a.
- Updated: 2026-10-25. Agent: Codex.

## Authorized outcome

Publish an updated map workspace with entity-based layers, six audience presets, eight coverage categories, organization subtypes, honest refresh feedback, one source hub and consistent China/Taiwan presentation. Preserve map/globe/wire, languages, themes, one/two screens, missing data and independent clocks.

## Steps

1. Extract organization-label coverage from pinned OpenDigger YAML and country-level model/dataset publisher samples from the already pinned GOSD source. Keep provenance; do not collect or infer facility locations.
2. Add a small optional validated observation catalog, pure preset/layer selection and shared geographic display helpers.
3. Implement the left entity rail, preset selector, right coverage summary, event filtering and refresh feedback. Concentrate attribution in the source hub; keep scope/time/DEMO visible.
4. Verify contracts, presets, geographic grouping and malformed inputs; update existing browser acceptance for intended UI changes. Review desktop/mobile/light/dark through the managed preview using the Sites preview guidance.
5. Update architecture/data/context documentation. Run checks and PR CI, merge with a pinned head, verify Pages and the public entry.

## Boundaries

Organization labels are an index, not a deduplicated global census of legal entities. Explicitly labeled repository identities are not the monthly measured set. Publisher samples are not full-platform geography. Unknown facilities display pending, not zero. China/Taiwan grouping must not sum or rewrite source observations. Refresh animation only follows actual checks or newly published events, with reduced-motion support.

## Verification / handoff

Implementation complete. Local typecheck, 74 deterministic tests (including six Python collector tests), documentation/data generation checks and production build passed. Managed-browser review checked desktop 1280 × 720 (no page overflow, 122px event feed), mobile width and preset interactions. PR browser acceptance and Pages verification remain the final deployment gates. Exact run/commit/deployment evidence will be recorded in #24. Remaining source/identity work stays with #9, #15, #16 and #18.
