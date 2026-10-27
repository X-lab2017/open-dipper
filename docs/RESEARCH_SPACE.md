# Research space / 研究空间

Product review 1.12.0 · 2026-10-27. **Local working prototype; Open Notebook backend is not deployed or connected.**

## User experience

A notebook holds one question or topic over time. Intelligence remains the shared reading library; Research links selected evidence into private-in-this-browser work. No account or cloud privacy guarantee is implied.

| Surface | What works now | Boundary |
| --- | --- | --- |
| Topic bar | Create, rename, switch local notebooks | 12 notebooks; no team/account synchronization |
| Sources, left | Explicit import of Intelligence saved items; search the actual catalog; link/unlink sources; inspect provenance | 40 linked sources; catalog excerpts, not full text or audiovisual analysis |
| Research, center | Suggested questions, editable draft, saved questions with the exact selected IDs | No model calls; saved questions never auto-execute later |
| Notes, right | Manual notes, question-to-note, brief/comparison/plan templates; automatic local save | 30 notes, 20,000 characters each; template is not a generated finding |
| Export | Markdown and versioned JSON containing questions, notes and source metadata | OpenDipper exchange format, not Open Notebook native import; no automatic upload |
| Walkthrough | Explicitly opened fictional Aurora example, clickable citations and save-to-note | Fixed script, not real research; separate notebook and demo labels |
| Earlier work | Previous drafts and Following remain accessible | No destructive migration or simulated updates to real notebooks |

Desktop has one compact toolbar and three independently scrolling columns. At narrow widths, Sources / Research / Notes become tabs. Both themes and languages use existing brand/tokens. No model selector, fake progress animation, unused upload button or podcast control is exposed before its capability exists.

A useful review route: save two articles in Intelligence → open Research → import saved → exclude one source → save a question → turn it into a note → switch notebooks and return → export. A separate fixed example illustrates answer → citation → note.

## Actual state and safety contracts

`src/intelligence-room/notebook-model.ts` owns bounded normalization, context selection and export. `notebook.ts` owns interaction and original rendering. `od:notebooks-v1` is independent of `od:reader-v1` and earlier `od:agent-room-v2`; no old drafts are removed. Storage failures show a message and the session can still export. Browser clearing removes local persistence.

Questions capture source IDs when saved; later deselection/unlinking does not rewrite prior context. Export includes IDs referenced by older questions and notes, even when no longer linked. Missing source records remain unavailable. This is a current metadata export, not immutable archival of source revisions; full source-version pinning is a backend prerequisite. Ordinary notebooks exclude fictional sources from context. Sources stay source-labelled; notes keep manual/template/demo origin. User text is escaped, links restricted to HTTP(S), no rendered user HTML. No remote content grants tool permissions.

## What to reuse from Open Notebook

Reviewed upstream commit [`a0f6f3081ae06328f0a451b3a3ef2959ca25721d`](https://github.com/lfnovo/open-notebook/tree/a0f6f3081ae06328f0a451b3a3ef2959ca25721d), specifically:

- [README](https://github.com/lfnovo/open-notebook/blob/a0f6f3081ae06328f0a451b3a3ef2959ca25721d/README.md): self-hosted application, Python/FastAPI, Next.js/React and SurrealDB; MIT declaration.
- [Interface](https://github.com/lfnovo/open-notebook/blob/a0f6f3081ae06328f0a451b3a3ef2959ca25721d/docs/3-USER-GUIDE/interface-overview.md): notebook-level Sources / Notes / Chat, context inclusion, citations and save-to-note.
- [Content model](https://github.com/lfnovo/open-notebook/blob/a0f6f3081ae06328f0a451b3a3ef2959ca25721d/docs/2-CORE-CONCEPTS/notebooks-sources-notes.md): shared sources, notebook-owned notes, source-owned insights.
- [REST API](https://github.com/lfnovo/open-notebook/blob/a0f6f3081ae06328f0a451b3a3ef2959ca25721d/docs/7-DEVELOPMENT/api-reference.md): notebook/source/note/chat APIs, asynchronous processing, streaming and error semantics. Running OpenAPI remains authoritative.

Borrow the task model, not the entire administration UI. OpenDipper puts conversation in the center and outputs at right to continue its reader ergonomics. No upstream code or assets are copied. This version integrates the **product pattern and OpenDipper evidence**, not the Open Notebook service or source code. The upstream license does not select this repository's license.

## Proposed live integration (not implemented)

Keep OpenDipper's public Pages client and notebook UI. Run Open Notebook privately as the research engine behind an OpenDipper server-side gateway. Do not iframe its complete administration interface or ship provider keys to Pages.

| OpenDipper object/action | Upstream area to adapt | Required mapping |
| --- | --- | --- |
| Research notebook | `/api/notebooks` | Workspace-scoped notebook ID, title, owner |
| Selected catalog source | `/api/sources/json`, notebook source linking | Canonical source ID, origin URL, excerpt vs full text, independent dates, version and permitted content |
| User uploads (later) | `/api/sources` and status | Explicit upload authorization, processing status, failure/retry, retention |
| Question with checked context | `/api/chat/context`, `/api/chat/sessions`, `/api/chat/execute` | Exact included sources/notes, server-selected model, run budget and cancellation |
| Source-grounded answer | Chat response and citations | Validate source references against allowed context; expose missing evidence and errors |
| User note / saved answer | `/api/notes` | Manual vs model origin; answer/run and source version references |
| Future podcast | `/api/podcasts/generate` | Separate user action, cost limit, actual job result; not initial pilot scope |

Do not hard-code inferred payload shapes from this document: generate/check contracts against the deployed instance's OpenAPI before connecting. Upstream API documentation describes one shared password, not multi-user accounts. Institutional/private work requires gateway identity, workspace isolation, access checks, quotas, audit and storage policy before exposing it to users. Provider credentials and the shared service password stay server-side.

Pilot sequence:

1. **This review:** validate whether users can collect evidence, state a question and keep a useful note without instruction.
2. **One-topic live pilot:** deploy backend; connect one configured language/embedding provider; import a small permitted corpus; deliver cited answers with real failure/cancellation states. No automatic bulk submission of existing drafts.
3. **Recurring work:** version evidence and accepted notes; detect meaningful changes; only then connect Following and explicit delivery preferences.
4. **Institutional value:** shared reviewed briefs, private evidence and access isolation. X-lab supplies public data/methods; OpenShare can operate commercial workspaces after actual value and costs are validated. No billing or entitlement service is implemented.

## Validation evidence

See [execution plan](plans/research-space.md) and the linked PR receipt for actual checks/deployment. Product review is not acceptance of a live Agent system.
