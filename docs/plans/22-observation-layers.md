# Execution plan: entity-first observation layers

- Execution state: completed (design deliverables only; implementation remains open)
- Issue: [#22](https://github.com/X-lab2017/open-dipper/issues/22); review branch `design/observation-layers-v1`
- Baseline: `50a3c4adbdd2f42d9f0322b3e6e6fac8c9bbbef7`
- Updated: 2026-10-25
- Collaborator: Codex, AI-assisted source review, architecture, interaction design and reference types

## Outcome and boundaries

Design a compact left sidebar that tells users what entity they are observing, what the metric means and how it is placed geographically. Reuse OpenDigger classification and GOSD methods, and distinguish data-center facilities from jurisdictional policy actions. Preserve Map / Globe / Wire, visual baseline, independent clocks, unknown values and explicit demos.

This iteration delivers [the RFC](../OBSERVATION_LAYERS.md), a source-native SVG and typed reference model/catalog. It does not migrate runtime code, refresh data, collect facilities or deploy a new interface. This is a design review branch; no production merge is required to review it.

## Checkpoints and decisions

1. Inspected the current evidence adapter, geography contract, intelligence contract, visual tokens and repository harness.
2. Read pinned OpenDigger label examples, GOSD contribution/influence/AI-supply methods, and the policy tracker's original page.
3. Chose six navigation objects, object-specific metrics, source-supported filters and independent event overlays. Organization-community navigation deliberately retains developer as measured subject.
4. Specified independent entities, facets, temporal relations, geographic roles, metrics, populations, observations, documents and events. Source documents do not determine event locations by mention alone.
5. Created three sidebar states and a ten-view catalog with current-data, planned-adapter and source-needed states.
6. Added documentation/agent discovery, validated the reference types and reviewed the rendered SVG. Delivery evidence is recorded below and in #22.

## Verification

| Criterion | Check | Actual result |
| --- | --- | --- |
| Subject-specific metric/geographic role bindings | Standalone TypeScript command in [design README](../design/README.md) | Passed |
| Scope and provenance | Compared pinned YAML examples and report methods against RFC/catalog | Reviewed; dataset snapshot periods remain unknown where unpublished |
| Compact state design | Rendered SVG using Inkscape and visually inspected PNG | Passed visual inspection of three states; not browser UI acceptance |
| Documentation and context | `npm run docs:build` and `npm run docs:check` | Passed: 3 generated mirrors; 44 Markdown files, 344 local links, 11 task recipes and 6 language editions |
| Build compatibility | `npm run build` | Passed: evidence and token consistency, 6 design tests, application typecheck and Vite build |
| Production UI / deployment | Not applicable to this design-only change | Not performed; no claim of a new published interface |

## Resume / implementation

Start with stage A in the RFC and scope it in #22: bind `evidence.maps.developers` and `.contribution` to developer; `.influence` to code project; retain `geography.layers[*]` as an organization-associated contributor view with a distinct score. Introduce a runtime layer registry and validated shared selection state before adding data sources. Run observatory/portal UI suites only when runtime interaction changes.

Stage B needs bounded label resolution and the original GOSD regional data, not a redistribution of global totals. Stage C needs a separately licensed/verified facility source and policy status evidence. #16 owns entity/event evidence, #9 owns genuine monthly geography, #15 owns controlled ingestion and #18 owns editorial review. No existing issue is completed by this proposal.

Open decisions for outcome review: whether the six-object selector is sufficiently compact, whether organization-associated community deserves an additional developer-side shortcut, and which facility source meets scope and reuse requirements. These do not block review of the model and sidebar design.
