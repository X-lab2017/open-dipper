# Research space / 研究空间

2026-10-27 · maintainer-directed AI-assisted product review.

## Outcome and acceptance

Replace the Research landing with an Open Notebook-inspired notebook workspace: sources at left, questions/conversation in the center, notes and outputs at right. Topic switching stays compact. Intelligence reading and the first three modules remain unchanged.

- Create/rename/switch up to 12 local notebooks without losing the prior drafts.
- Explicitly import saved sources or choose exact records from the existing catalog; include/exclude sources from question context; inspect citations.
- Questions retain the exact selected source IDs and stay labelled unexecuted. No pretend model output.
- Write and edit notes; create clearly labelled brief/comparison/research-plan templates; export source-bearing Markdown and a portable JSON bundle.
- An opt-in fictional walkthrough illustrates answer → citation → note, separate from ordinary research.
- One-screen desktop, mobile Sources / Research / Notes tabs, bilingual and paired themes.
- Open Notebook remains a documented backend integration target, not an embedded or deployed service. No credentials, account creation, private uploads, inference or collection.

## Execution

1. Read current contracts and upstream README, interface, content model and API docs.
2. Build bounded local notebook state and original UI, retaining old drafts and Following.
3. Verify isolation, context capture, note/export persistence and source escaping; run existing regression suites and browser review.
4. Update current docs, source mapping and actual release evidence.

## Validation

Local typecheck, complete npm test, production build and docs checks passed. Browser inspection confirmed exact one-screen bounds (top 125 / bottom 936), source import/search, question persistence, notebook isolation, editable notes, citation detail and paired themes. CI covers compact desktop, mobile tabs, export contents and earlier module regression. Final CI and Pages evidence will be recorded in the PR receipt.
