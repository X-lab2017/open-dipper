# Ecosystem galaxy review version

Execution state: **completed** (historical 1.4.0 private review). Public delivery is now recorded in [release 1.5.1](ecosystem-public-release.md). Maintainer approved the dual-galaxy interaction design on 2026-10-26. Implementation starts from accepted application 1.3.2; the map/radar baseline remains immutable. This change is AI-assisted engineering by Codex.

## Outcome

Turn the ecosystem destination into a real, explorable project/model network. Keep the five-section shell and paired themes. A visitor can discover a technical community, search and locate a node, inspect why it is connected, follow a neighbor, and open the original community. Provide a guided presentation with an obvious stop/return.

## Scope and boundaries

- Import pinned OpenGalaxy and ModelGalaxy snapshots from the maintainer-provided OG-And-HG-2026 repository, with fingerprints and original observation windows.
- Independently implement the renderer and interface. Do not copy upstream application code or assume a new license grant.
- Two spatially separated networks in one overview; code/model views; search; category and entity filters; neighborhood; accessible result list; local watch; stable focus and camera; expanded view; bilingual guide and sources.
- Shared-contributor relations are not dependencies or direct collaboration. Model inferred relations remain optional, visually differentiated and excluded from observed relationship counts. Upstream undirected exports cannot establish lineage direction.
- Snapshot relationships are not live event streams. No fabricated cross-network edges, synthetic historical playback, growth curves, or missing-to-zero metrics.
- Node detail integrates matching existing monthly samples where available, without extrapolating to the other nodes.

## Execution

1. Pin and compact real data; validate indices, semantics, metadata and hashes.
2. Implement isolated `src/galaxy/` model/renderer/view, lazy loading and partial failure handling.
3. Integrate atlas navigation and optional radar-to-galaxy entry, preserving other modules.
4. Test data/model behavior, typecheck, full deterministic suite/build; inspect desktop dark/light, search, filters, neighborhood, tour stop, expanded return, English and mobile through managed browser preview.
5. Publish the existing private Sites review destination; record the returned source commit/version/deployment. The subsequent public release is recorded separately in 1.5.1.

## Acceptance evidence

- Real data import preserves all 43,771 identities and coordinates and all 149,913 source edges. Hashes, endpoint validity, periods and inference flags pass the importer check.
- `npm run typecheck`, the full `npm test` suite (including nine new graph/model tests), and `git diff --check` passed on the review branch.
- Managed Chromium preview: universe 43,771 nodes / 125,955 recorded edges; model view 24,000 nodes / 19,305 recorded edges, rising to 43,263 with inference enabled. Search retains the surrounding network. PyTorch opens its 387 recorded neighbors and edge explanations; its existing monthly OpenDigger series is available.
- Browser checks cover dark/light themes, Chinese/English, expanded return/Escape, model inference, tour stop, one/two-screen (24-card continuation), radar-to-Qwen model navigation, and return to the global map. A 390px iframe viewport renders without document horizontal overflow, with mobile explorer collapsed initially. This is responsive-layout coverage, not a physical-device test.
- New `tests/galaxy-ui.mjs` is wired into the existing CI browser command. Its standalone browser runner was not launched in the managed environment; equivalent interactions above were inspected through the supported browser. This record is not a CI pass; the subsequent 1.5.1 release records actual GitHub browser acceptance.
- Review fixes: search no longer hides the neighborhood; changing modes clears stale deep links; radar entry clears previous breadcrumbs and writes the focused node's share URL. Missing/partial source data is validated in model tests; network-failure UI is implemented but has not been browser fault-injected.

- Production build passed through the Sites build helper with the same source/dependency lock. The private review deployment succeeded. No public `main` release or GitHub CI run was performed for this branch.
- Watch/filter/unwatch and opening the guide while expanded also passed in the managed browser. One browser input call timed out; a fresh DOM and screenshot confirmed the intended universe state with 43,771 nodes and no open modal.

## Historical review receipt

Private review 1.4.0 was deployed successfully on 2026-10-26 from source `186d88fd1cfd7a6ac0d447fd90795e507d9d8d3b`; archive SHA-256 `55b13411331d70fd7df3eeda8a8ed9038896a3f51fc74d0a1b8fc568ff16baf6`. [Review screenshot](https://raw.githubusercontent.com/X-lab2017/open-dipper/ae3da3e0fa00a3ef7167b8d26a3196d7c1fdd0bc/docs/assets/opendipper-galaxy-review-20261026.jpg) records the tested managed preview. The protected hosted page was not inspected after sign-in.

Private hosting identifiers and obsolete publication instructions were removed during closeout. The prior record is recoverable at [commit 3d89ddf](https://github.com/X-lab2017/open-dipper/blob/3d89ddf5cf59f5c700a058f91ade413f6284dae8/docs/plans/ecosystem-galaxy.md). Current publication evidence is [1.5.1](ecosystem-public-release.md); remaining data/validation limits are maintained once in [the galaxy contract](../OPEN_GALAXY.md).
