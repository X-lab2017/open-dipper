# Observation layer design artifacts

Review proposal, **not a deployed data API or UI**. Product rationale and source evidence are in [the RFC](../OBSERVATION_LAYERS.md), tracked in [issue #22](https://github.com/X-lab2017/open-dipper/issues/22).

- [Sidebar design](observation-layers-v1.svg): three states using the existing dark-theme tokens. The model state illustrates a future adapter, not available geographic data. Editable SVG text uses system CJK fallback fonts; no external font or source-site artwork is bundled.
- [Reference types](observation-model.ts): entities, classification, relationships, geography assertions, observations, provenance, openness, documents, events and separate policy/facility transitions. A metric's subject constrains its metric ID and geographic role.
- [Catalog](observation-catalog.ts): ten proposed views, three metric definition examples and two population examples. This is a partial specification, not a complete data package. IDs without example definitions must be resolved during implementation. No runtime consumer imports it.

`existing_adapter` means current bundled data can be adapted; it does not mean the new sidebar exists. `planned` means a referenced source supports a scoped adapter; `source_needed` means the publishable dataset or evidence is still missing. `availableFilters` describes current data capabilities; `proposedFilters` never enables filtering by itself. Navigation and measured subject can differ: the organization-community view measures developers, not organization headquarters.

Type-check these reference files with the repository's installed TypeScript:

```sh
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution Bundler docs/design/observation-model.ts docs/design/observation-catalog.ts
```

This verifies structural typing, not date validity, referential integrity, URLs, identity resolution, rights or factual correctness. Future runtime adapters must reject unresolved references, duplicate IDs, cyclic label expansions, incompatible subject/metric/geography combinations, invalid coordinates and incompatible slices. Keep source/coverage/time checks in the same adapter; do not treat these interfaces as a security boundary.

The catalog preserves the three existing OpenShare meanings, the independent trailing-year organization-community score, and separate publisher-sample and facility-policy semantics. It intentionally supplies no invented facilities or coordinates. This design does not change versioned production data, parent branding or the accepted application visual baseline.
