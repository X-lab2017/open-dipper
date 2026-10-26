# Ecosystem galaxy review version

Status: implemented and deployed for private review. Maintainer approved the dual-galaxy interaction design on 2026-10-26. Implementation starts from accepted application 1.3.2; the map/radar baseline remains immutable. This change is AI-assisted engineering by Codex.

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
5. Publish the existing private Sites review destination; record the returned source commit/version/deployment. Public main release follows outcome review.

## Acceptance evidence

- Real data import preserves all 43,771 identities and coordinates and all 149,913 source edges. Hashes, endpoint validity, periods and inference flags pass the importer check.
- `npm run typecheck`, the full `npm test` suite (including nine new graph/model tests), and `git diff --check` passed on the review branch.
- Managed Chromium preview: universe 43,771 nodes / 125,955 recorded edges; model view 24,000 nodes / 19,305 recorded edges, rising to 43,263 with inference enabled. Search retains the surrounding network. PyTorch opens its 387 recorded neighbors and edge explanations; its existing monthly OpenDigger series is available.
- Browser checks cover dark/light themes, Chinese/English, expanded return/Escape, model inference, tour stop, one/two-screen (24-card continuation), radar-to-Qwen model navigation, and return to the global map. A 390px iframe viewport renders without document horizontal overflow, with mobile explorer collapsed initially. This is responsive-layout coverage, not a physical-device test.
- New `tests/galaxy-ui.mjs` is wired into the existing CI browser command. Its standalone browser runner was not launched in the managed environment; equivalent interactions above were inspected through the supported browser. A future GitHub PR must report the actual CI result rather than treating this record as a CI pass.
- Review fixes: search no longer hides the neighborhood; changing modes clears stale deep links; radar entry clears previous breadcrumbs and writes the focused node's share URL. Missing/partial source data is validated in model tests; network-failure UI is implemented but has not been browser fault-injected.

- Production build passed through the Sites build helper with the same source/dependency lock. The private review deployment succeeded. No public `main` release or GitHub CI run was performed for this branch.
- Watch/filter/unwatch and opening the guide while expanded also passed in the managed browser. One browser input call timed out; a fresh DOM and screenshot confirmed the intended universe state with 43,771 nodes and no open modal.

## Private review receipt

- URL: https://opendipper-layer-atlas-review.token4all.chatgpt.site/#ecosystem
- Application: 1.4.0 review; Sites version: **11**.
- Project: `appgprj_6addd5731fbc819190147b9c38afbb85`.
- Pushed and deployed source: `186d88fd1cfd7a6ac0d447fd90795e507d9d8d3b`.
- Saved version: `appgprj_6addd5731fbc819190147b9c38afbb85~appgver_e8ca47c6b1e481918dff9c25e5bbc4e9`.
- Deployment: `appgdep_6adf0a5ec3bc81918e64f12373de7423`; status `succeeded` on 2026-10-26.
- Source archive SHA-256: `55b13411331d70fd7df3eeda8a8ed9038896a3f51fc74d0a1b8fc568ff16baf6`.
- Owner-private audience preserved. The cloud browser reached the expected ChatGPT sign-in gate. Automatic approval review rejected initiating sign-in because explicit account-login authorization was absent; no login or workaround was attempted afterward. Therefore logged-in production UI was not inspected. Functional and visual checks above are from the managed preview, not the protected production session.
- [Review screenshot](../assets/opendipper-galaxy-review-20261026.jpg) records that tested preview. This receipt and screenshot were added after publication; they are not claimed to be inside the deployed source commit.

## Next contribution tasks

1. Review graph density, initial landmarks and the exploration journey on actual large screens; tune labels without changing metric semantics.
2. Add newer model snapshots and explicit upstream permissions; preserve the previous snapshot's identity and clocks.
3. Recover directed lineage only from source fields that preserve direction; collect evidence for real code/model bridges.
4. Add comparable monthly network frames and stable layouts before offering time playback.
5. Run the wired browser suite in GitHub CI before a public-main release; fault-inject single-source failures and test on physical touch devices.
