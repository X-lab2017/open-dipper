# Execution plan: accepted atlas baseline and AI radar proposal

> Current disposition (2026-10-26): Design completed and implemented through PR #27–#29. Current behavior is AI_RADAR.md; original review questions and SVG verification below are historical.

- Execution state: completed (design and reusable-baseline artifacts); implementation subsequently completed through 1.3.2.
- Review: [#26](https://github.com/X-lab2017/open-dipper/issues/26).
- Accepted application commit: `7b27609dd3d02ae12e6987c3c989f0a5a6da561c`.
- Working branch: `docs/atlas-baseline-ai-radar`, based on `97cd19b` (includes scheduled snapshots).
- Updated: 2026-10-26. Collaborator: Codex; design review was superseded by the accepted 1.3.2 implementation, recorded in [#26](https://github.com/X-lab2017/open-dipper/issues/26).

## Outcome and boundaries

Record the accepted application 1.2.0 / visual 1.3.0, supply a reusable module worksheet and deliver an evidence-grounded AI radar proposal with dark/light static design boards. Keep production UI/data, portal runtime, payment and collector behavior unchanged. Future implementation starts only after product review.

## Checkpoints and decisions

1. Read current repository contracts, accepted release receipts and design source. Pin 10 source files with SHA-256 fingerprints; source snapshots remain independent.
2. Read Thoughtworks and Zalando primary documentation; inspect fixed GOSD chapter 4/5 Markdown and CSV plus the Agentic AI Landscape canonical CSV. Do not reuse third-party application code or illustrations.
3. Record two lenses, three initial user tasks, three editorial rings plus pending, data/assessment separation, focused layout, contribution workflow and staged sustainability model.
4. Produce original dark/light SVG boards and a model/data state using accepted tokens and existing brand assets; all points and example labels explicitly illustrative.
5. Add template/baseline/rights to the existing portable design package; update bilingual README links and generated Agent discovery context.
6. Verify documentation, source fingerprints, SVG rendering and package build; publish documentation through a normal fast-forward GitHub write preserving any newer snapshots.

## Verification and delivery

| Criterion | Check | Result |
| --- | --- | --- |
| Fixed baseline matches accepted implementation | Read exact Git commit; compute 10 source SHA-256 values | Passed |
| Source counts and windows are grounded | CSV parsing and source explanations; fixed commits in proposal | Passed; not a license or recommendation audit |
| Documents and generated context | `npm run docs:build`, `npm run docs:check` | Passed; bilingual links and task entries checked |
| Three SVG boards | XML inspection, CairoSVG render and image review | Passed; CJK glyphs and control icons corrected; no real recommendations |
| Portable assets and existing build | `npm run build` including design package, six design tests and TypeScript | Passed; all four existing entrypoints built; required ZIP entries and CRC verified |
| Runtime remains unchanged | Diff review | No frontend runtime, token or observed-data changes; package/docs/context only |
| GitHub documentation sync | Same commit as this plan; issue #26 | Issue created; commit history records sync; CI/Pages checked separately |

Local Playwright rendering was unavailable because its Chromium binary was not installed. Static SVG verification uses a separate renderer; this does not claim application browser acceptance. No radar implementation tests, model evaluations or user interviews were performed.

## Historical handoff after review (completed)

Read [the proposal](../design/AI_RADAR_PROPOSAL.md), [baseline](../../design/baselines/atlas-1.3.0.md) and issue #26. Confirm the two lenses, tasks, assessment semantics and minimum evidence coverage. Then create a separate implementation plan; tie sources/evidence/editorial/entitlement work to existing issues #15–#19. Keep current runtime contracts authoritative until each capability is delivered and verified.
