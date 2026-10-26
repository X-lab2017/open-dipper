# Open Galaxy 1.5.1 — completed public release

- Execution state: **completed**. Recorded 2026-10-26.
- Delivered through [PR #33](https://github.com/X-lab2017/open-dipper/pull/33), merged at **2026-10-26 21:15:13 Asia/Shanghai** (13:15:13 UTC).
- Landed application commit: [`8c12aa77312f0e9ed488c81eda4ca5806a7b993e`](https://github.com/X-lab2017/open-dipper/commit/8c12aa77312f0e9ed488c81eda4ca5806a7b993e), version **1.5.1**.
- [Production CI / Pages 40328984137](https://github.com/X-lab2017/open-dipper/actions/runs/40328984137): build and deploy succeeded; deployment completed at **2026-10-26 21:29:37 Asia/Shanghai** (13:29:37 UTC).
- [Public ecosystem route](https://www.x-lab.info/open-dipper/#ecosystem). Publication is established by the Pages job; committed images are CI captures, not a separate inspection of the hosted page.
- AI-assisted work: Codex recovered source, refined themes, repaired interactions, tested and documented the release. Later documentation closeout checked GitHub merge/run/job metadata.

## Delivered outcome

Visitors can discover projects by task, explore recorded neighborhoods and paths, compare up to three candidates and download sourced Markdown, HTML and JSON reports. Dark/light colors and bounded motion were strengthened; pauses, reduced motion, mobile layout and expanded-view return were verified. Both README editions retain separate global-observation, AI-radar and galaxy images and explanations.

The recovered 1.5.0 source was `799f04a15b5670b786fdba0e063e12df8ab10e7c`. Integration started from public `b7647de4fd38cef3229bbd3b182767ea2c6f6a20`, preserving current snapshots, shared navigation and the immutable accepted map/radar 1.3.2 baseline. No new inference, synthetic observation or license grant was introduced. Source clocks and missing values remain explicit.

## Verification sequence

| Stage | Exact source / evidence | Result |
| --- | --- | --- |
| Local checks | Node 24; typecheck, complete tests, build, docs and diff checks | Passed; local Chromium was unavailable, so browser acceptance used CI |
| Product acceptance | `ae0883a1cccf1ffbd6c3a4945467a18500cb45f9`; [CI 40327243123](https://github.com/X-lab2017/open-dipper/actions/runs/40327243123) | Passed, including actual three-format report downloads |
| Final PR head | `f712408c982fcebbcbd094ad9cf8f24997b6e7f5`; [CI 40328429918](https://github.com/X-lab2017/open-dipper/actions/runs/40328429918) | Passed before merge |
| Main publication | `8c12aa77312f0e9ed488c81eda4ca5806a7b993e`; [CI / Pages 40328984137](https://github.com/X-lab2017/open-dipper/actions/runs/40328984137) | Build, browser acceptance and deployment passed |

## Lessons retained from failed attempts

- [First browser run](https://github.com/X-lab2017/open-dipper/actions/runs/40323570918): search blur triggered an overbroad change handler and replaced the target before click. The handler was scoped to its own controls; the test retains real repeated mouse clicks and DOM-identity checks.
- [Second browser run](https://github.com/X-lab2017/open-dipper/actions/runs/40324810321): a motion-frame equality check failed before selection; the oversized PNG log did not distinguish pause from reduced-motion failure. Tests now wait for the renderer's applied state and queued base frames, then compare four hashes over 540 ms with compact diagnostics. The static-frame requirement remains intact; subsequent full runs passed.

## Completion boundary

No merge or deployment step remains in this plan. Continue new work from [the current galaxy contract](../OPEN_GALAXY.md) and [status / live issues](../STATUS.md). PDF printing, physical touch devices and single-source failure UI fault injection remain unverified; they are follow-up validation scopes. The original interruption's cause remains unknown. No protected-site login was used.

## Verified 1.5.1 browser receipt

- Product head: `ae0883a1cccf1ffbd6c3a4945467a18500cb45f9`; tree `a223c6e682987b69043129855304aee1b820ae04`. [CI 40327243123](https://github.com/X-lab2017/open-dipper/actions/runs/40327243123) completed successfully on 2026-10-26: full deterministic checks, production build, repository-subpath browser acceptance for atlas/radar/galaxy/panorama/analysis.
- [Browser artifact 12651721664](https://github.com/X-lab2017/open-dipper/actions/runs/40327243123/artifacts/12651721664): 26 files, 12,700,166 bytes; archive SHA-256 `69ef74f4614a3be9f1c579432a5bf03f6c4593d3edc671846a487ea783af6cdb`. CI artifacts have seven-day retention; the three galaxy screenshots are preserved below.
- Search blur preserves the pointer target; real repeated clicks select PyTorch. Recorded PyTorch–vLLM path, shortlist, report opening and three-format downloads passed. Expansion/Escape, inference toggle, tour stop, English/mobile view and returning through radar/map passed with no page errors.
- Running effects changed actual pixels. Paused and live-reduced states each produced four identical complete-canvas hashes over 540 ms: `848bfbf0eecaec9c56a47bbfc91ef7c58d93adda01d74719125788da4eb3b302`.
- Source clocks stay distinct: code window 2025.08–2026.07; model snapshot 2026-08-05; report generation time is not an observation clock. Inferred links remain excluded by default. Missing/sample limitations remain explicit.
- These captures are CI evidence, not production or physical-device screenshots. PDF printing and real touch devices remain untested. Protected Site account login was not attempted.

### Preserved captures

[Dark overview](../assets/opendipper-galaxy-1.5.1-dark-overview-20261026.png) · [Light research workspace](../assets/opendipper-galaxy-1.5.1-light-research-20261026.png) · [Mobile layout](../assets/opendipper-galaxy-1.5.1-mobile-20261026.png). README editions retain the earlier separate map and radar captures and now use the 1.5.1 light workspace.

### Actual downloaded report files

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `pytorch-report.html` | 18110 | `d75c5263d699e049876d89c7eff198e2fd1fea63d1db3484dd72b6ee3b6702ea` |
| `pytorch-report.json` | 10049 | `fab5acd9a8e8fab0e049ed4618b29f74cade5bf00fc9fb98eaca15760f57be04` |
| `pytorch-report.md` | 5992 | `60eba81cda508aded4604955ef3f2861f4fe97fd01366c95c8df487d6ae62db3` |

All three were received from real browser download events, saved and read back; they identify `pytorch/pytorch` and retain the code observation window. HTML is self-contained; JSON preserves structured sources; Markdown retains the report sections. The final merge and production deployment are recorded above. The detailed archive has seven-day retention; committed captures and these hashes preserve the review evidence.
