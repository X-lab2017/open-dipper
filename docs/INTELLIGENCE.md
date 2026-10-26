# AI and open-source intelligence framework

Application baseline **1.1.0**, 2026-10-25. Delivery: [#14](https://github.com/X-lab2017/open-dipper/issues/14). This is a public review framework, not a launch of paid subscriptions or an autonomous research service.

The application 1.3.0 radar now has a dedicated [implementation contract](AI_RADAR.md). It supersedes the former radar route described in the 1.1.0 delivery; other portal services retain their boundaries below.

## Product and routes

| Route fragment | Implemented experience |
| --- | --- |
| `#overview` (default without a fragment) | Map / globe / wire, geography layers, sourced events and a compact AI/sample-brief rail |
| `#radar` | Two task-oriented lenses, 30 sourced candidates, separately simulated rings, evidence, comparison, local watch and trial export |
| `#ecosystem` | Same-platform, same-month OpenDigger rankings, 12-month trend, metric evidence and project stars |
| `#briefing` | Public sample brief, proposed Open/Pro comparison, local topic/cadence preferences and Markdown export |
| `#following` | Locally followed radar candidates, plus selected topics, saved signals and exactly linked watched repositories |
| `#contribute` | Research and support participation, actual issue links, no invented contributor or sponsor roster |

Top-level product navigation is distinct from the Map / Globe / Wire view switch. One-screen desktop overview keeps the map dominant. Two-screen presentation adds AI selection, sample brief and an ecosystem-analysis entry on its second screen. Phones use natural document flow. Existing `analysis.html` and `panorama.html` remain compatible.

## Shared content and evidence

`src/observatory/intelligence.ts` owns signal contracts, explicit topic mapping, fixture validation, matching, route allowlisting and exports. `portal.ts` renders the new surfaces and handles their user actions; `portal.css` composes the existing visual tokens. `main.ts` owns the application state, shared dialogs and connection to the existing scene.

A signal carries:

- Stable ID, topic, bilingual title/summary, provenance, source URL and optional original event ID.
- Independent publication and capture timestamps; no timestamp is rewritten on deployment.
- Analysis/next-step text, with demo examples distinguished from pending real analysis.
- Evidence items with material type, status and optional HTTP(S) URL.
- Separate openness text and optional documented event location. Unknown location remains null.
- Optional exact repository path, used only to connect an already present OpenDigger sample.

Observed intelligence is derived from `events.json` through an **explicit repository map or `ai-topic:` tag**. This does not infer a subject from a source's reputation or claim broad AI coverage. Current data mainly contains configured PyTorch and vLLM releases. Original text is retained; it has not been newly translated, summarized or reviewed by a live Agent. `source-published` is not independent verification. The current roster and received count may change with collectors.

Demo intelligence lives in `public/data/intelligence-demo.json`: schema version 1, fixed fixture date 2026-10-24, eight fictional records across four topics. Three are unlocated and five have explicitly simulated coordinates. Fictional evidence slots have no factual URLs, and fictional projects receive no observed monthly series. The file is optional and validated atomically; malformed/missing content produces an unavailable message without replacing observed data. Fixtures are not refreshed by scheduled collection.

`asDemoEvent()` adapts these eight records for map/wire display. Existing 13 fixed ecosystem scenarios remain in `demo.json`. The shared demo preference removes synthetic intelligence and synthetic events from all relevant lists, including saved items and export. The separate geographic demo layer retains its own explicit control. Public sample prose remains available as an editorial format even with demo cases hidden.

## Local state and service boundaries

`od:intelligence` contains only allowlisted topic IDs, up to 200 saved signal IDs, preferred daily/weekly cadence and demo visibility. It is validated on read and stored in localStorage; repository stars remain in `od:watch`. There is no email field, submission to a marketing list, account sync, push scheduler or payment action. Clearing intelligence preferences leaves repository stars intact. Browser-local state may disappear when storage is cleared; expired feed items are not a permanent content archive.

Matching is a union of exact repository links, selected topics and saved IDs. Demo visibility is applied before matching. Export generates a local Markdown file from the currently matched cache, retaining source URLs, timestamps and DEMO labels. It is not a new collection, human-edited report or activated subscription. A selected cadence is a preference, not a running automation.

Open/Pro is an explicitly labelled proposed service boundary, with no price or active paywall. All bundled sample content is public. A future paid service must keep full paid documents and entitlements on an authenticated server, outside public Git, JSON and static builds. A future OpenShare integration needs an actual API/authorization design; the current link simply opens its public homepage, with no shared account or promised resource eligibility.

## Research and support governance

People can propose sources, research questions, corrections and needs through GitHub. Agent engineering follows [HARNESS](HARNESS.md); the website does not dispatch agents. Topic editing, attribution and independent review need actual participants and consent. No fictional expert names, partners, funding awards or logos are displayed. Commercial support must be disclosed without changing measured values or natural rankings. No personal or confidential business discussions are part of this public specification.

## Follow-up work and release gates

| Task | What is still required |
| --- | --- |
| [#15 Sources and controlled Agent ingestion](https://github.com/X-lab2017/open-dipper/issues/15) | Rights-aware official sources, bounded collection, costs, error recovery, grounded structured Agent output and evaluation |
| [#16 Entity and geography evidence](https://github.com/X-lab2017/open-dipper/issues/16) | Model/paper/repository IDs, sourced relationships, event merges, location types and correction history |
| [#17 Membership and delivery](https://github.com/X-lab2017/open-dipper/issues/17) | Consent, identity, synchronization, delivery/opt-out, payment verification, server-side access and deletion/export |
| [#18 Research editorial process](https://github.com/X-lab2017/open-dipper/issues/18) | Consenting contributors, signed analysis, review, corrections and a real evidence-backed pilot brief |
| [#19 First content contribution](https://github.com/X-lab2017/open-dipper/issues/19) | One topic, 3–5 original sources, dates, project/paper links and a short explanation of value |

Continue existing reliability, editorial pagination and monthly geography tasks (#9–#13). A polished framework does not complete those contracts. Before advertising a paid service, demonstrate actual editorial capacity, reliable delivery, explicit entitlements and sustainable costs. Before claiming minute-level freshness, measure source publication → first capture → public availability separately.

## Verification and review

- Deterministic intelligence tests cover malformed fixtures, source mapping, unknown locations, local-state sanitization, demo removal, exact matching, safe routes, provenance-preserving export and unavailable optional content.
- `npm run test:portal:ui` covers routes, filters, evidence/map/project links, local persistence, downloads, public sample, task links, language/theme, mobile/tablet/desktop and optional fixture failure.
- Existing observatory suite retains map/globe/wire, camera, draft, source, layout and branding acceptance. Legacy UI suites remain enabled.
- Follow [REVIEW](REVIEW.md) for manual review and [STATUS](STATUS.md) for dated verification evidence. Test source is not evidence that a test was run; actual results belong to the delivery issue.
