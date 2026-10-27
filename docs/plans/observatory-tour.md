# Observatory composition and World tour — 1.6.0

- Execution state: completed (implementation, browser verification and Pages publication)
- Baseline: `2ee96698b1c34fd7efbfd7a340f2214ba1f93af5`; branch `feat/observatory-tour`
- Updated: 2026-10-27
- Implementation: [PR #38](https://github.com/X-lab2017/open-dipper/pull/38); maintainer-authorized, AI-assisted implementation and review.

## Outcome and acceptance

Preserve the accepted compact three-column structure and all data while centering the inhabited-world frame, unifying layer glyphs, opening Active developers by default, ordering the five default panels as developers / companies / benchmark projects / models / meetings, adding an explicit World tour, and naming the navigation Open Galaxy / 开源星系. The maintainer authorized Pages publication after verification.

## Decisions and boundaries

World tour visits the five panels once, at ten-second intervals, using the map for worldwide regional/bubble comparisons and the globe for sourced organization and conference locations. Camera stops are presentation choices, not new geographic evidence. Original periods, global ranking scope, samples, absent data and simulated pulse labels remain visible. Other layers, catalogs, routes and official logos remain available and unchanged.

The tour has previous/next, pause/resume and exit-to-original-workspace controls. Manual input, hidden pages and reduced motion pause autoplay. Reduced motion starts in manual mode. Leaving the module or page cancels timers. No autoplay on page load and no endless loop. The global camera uses a balanced Mercator extent for inhabited land, excluding Antarctica from the home frame, with resize-safe geographic coordinates.

## Checkpoints

1. Implement camera frame, shared geometry glyphs, defaults and bilingual module naming.
2. Add finite tour state/controller, responsive controls and workspace restoration.
3. Check camera geometry and controller lifecycle, full tests/build, browser layouts, all five tour stops, keyboard and reduced motion.
4. Review diff, open PR, pass CI, merge and verify Pages and production behavior.

## Verification and delivery

- `npm run typecheck`: passed.
- `npm test`: 129 Node tests and 6 Python tests passed; includes camera centering, finite tour timing/lifecycle and sourced anchors.
- `npm run build`: passed; docs/generated context checks passed.
- Managed browser preview at 1363×936: checked all five stops and matching map/globe/inspector states, exit restoration and both theme palettes; document height remains exactly viewport height, with the pulse visible.
- Added CI browser coverage for default panel order, shared glyph alignment, the five stops, selected-region/camera restoration, 1280×720 and 390×844 in both themes, English, keyboard/manual interruption, reduced motion, visibility and module navigation cleanup.
- Full CI browser acceptance passed on application head `c860a5216e136690ff4c2a75f2095fc406ac0dc8` in [run 40429292901](https://github.com/X-lab2017/open-dipper/actions/runs/40429292901). This includes the existing atlas/workspace/density/portal/radar/galaxy/legacy routes and new World tour cases.
- Pages publication is a separate gate: use the final [PR #38 receipt](https://github.com/X-lab2017/open-dipper/pull/38) for merge, production workflow and live verification. Deployment was not yet claimed when this record was committed.

2026-10-27 CI checkpoint: first run [40427877006](https://github.com/X-lab2017/open-dipper/actions/runs/40427877006) passed types, unit/data checks and build, then stopped on the legacy 10 E / 36 N browser camera expectation. Updated initial/Home/reset/zoom/resize expectations to the new 5 E / 41.80 N frame; geometry tests independently verify balanced Mercator bounds. Superseded by the successful browser run linked above.

Second CI checkpoint [40428149403](https://github.com/X-lab2017/open-dipper/actions/runs/40428149403): existing atlas, workspace and full density/theme/language/mobile browser checks passed. New tour test exposed that the meeting list omitted dates until opening details. Added sourced periods directly to meeting rows, explicit developer-fill context during thematic stops, and native map-fullscreen exit restoration with a browser regression check. Superseded by the successful browser run linked above.

Final review: no data snapshots, collection contracts, official logos or historical baseline fingerprints changed. The dated meeting rows, explicit underlying fill label, final-stop completion message and fullscreen restoration are covered by the final browser pass. Run 40428542631 was superseded while installing browser dependencies; its cancellation is not a failed application check. No engineering steps remain in this plan; production delivery status is authoritative in PR #38.

## Verified public delivery

[PR #38](https://github.com/X-lab2017/open-dipper/pull/38) merged as `a0506f48696171ec7459af8e51a894162a7701b3`. [Production CI / Pages 40429862249](https://github.com/X-lab2017/open-dipper/actions/runs/40429862249) passed and deployed at 2026-10-27 09:02:58 Asia/Shanghai. Live map centering, both themes, default panel order, all five stops and exit restoration were checked. Earlier pending-publication statements are checkpoint history, not open tasks.
