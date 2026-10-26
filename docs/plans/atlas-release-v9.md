# Atlas release: review workspace → GitHub

Status: active. Date: 2026-10-26. Implementation: [PR #25](https://github.com/X-lab2017/open-dipper/pull/25). Deployment receipt will be linked after validation.

## Scope and acceptance

Integrate the approved review workspace with the maintained production repository. Default map remains north-up, with the continental US on the left and China on the right. Center at 10° E / 36° N; constructor, Home and reset share one definition. Keep both visible on desktop and resize without camera jumps. Add a subtle globe instrument-ring sweep and geographic hover outline; synthetic pulses remain explicitly synthetic. Respect reduced motion.

Retain six groups / 18 layers, optional exclusive developer/asset choices, one area fill plus proportional asset bubbles and circular entities, audience presets, tabbed inspections, top-ten rankings, five global totals, compact pulse, dual themes, one/two screen layouts and independent map fullscreen. Keep all five product navigation sections.

## Integration boundaries

- New entry: `src/atlas.ts`, `src/atlas.css`; `index.html` uses it. `src/main.ts` remains the analysis compatibility entry; `panorama.html` stays supported.
- Preserve collectors, manual event approval, existing evidence/observation generators and current `public/data/events.json`. No incidental refresh of pinned data.
- One token generator: `scripts/build-design.mjs`; supports legacy CSS aliases, public downloadable assets, shared Canvas and atlas ramps. Application 1.2.0; visual system 1.3.0.
- Regional/report imports remain pinned snapshots with independent periods. All pulse growth and 12,840 intelligence inventory remain demonstrations. Git projection is unverified scenario input, not measurement.
- Scheduled collection still publishes sourced news. Browser acceptance is migrated to the new entry; legacy compatibility suites remain.

## Checkpoints

- [x] Import review application without overwriting legacy analysis or newer bot snapshots.
- [x] Align camera defaults and refine motion without inferred data links.
- [x] Deterministic tests, typecheck and production build.
- [x] Dark/light map/globe, responsive layouts and critical controls in browser.
- [ ] PR CI, merge and actual Pages deployment receipt.

## AI assistance disclosure

Implementation, documentation and validation were prepared with AI assistance under maintainer direction. Automated and browser evidence are reported independently; unrun checks are not claimed as passed. No paid service, live intelligence SLA or full accessibility certification is implied.

Local evidence: 95 Node tests plus 6 Python collector tests, typecheck and four-entry production build passed. Cloud browser checked dark/light map and globe, layer toggles, bubble overlay, fullscreen return and AI radar. Embedded viewport checks: 1280×720 and 1920×1080 stay within one screen; 390×844 uses vertical flow without horizontal overflow. CI remains the full scripted acceptance authority.

First PR CI passed all deterministic checks and build, then exposed a rapid fullscreen-exit / browser-window transition race. The implementation now awaits an in-flight native fullscreen request before exiting; UI acceptance checks actual native entry/exit and isolates viewport checks from the native-window transition.
