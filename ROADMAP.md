<!-- section:overview -->
# OpenDipper roadmap

**English** | [简体中文](ROADMAP.zh-CN.md)

Planning baseline: **2026-10-26 (Asia/Shanghai)**. This is a proposed sequence with acceptance gates, not a delivery-date commitment or a list of implemented features. [Current status](docs/STATUS.md) describes what exists; [coordination issue #8](https://github.com/X-lab2017/open-dipper/issues/8) links the work. Issue/PR state is authoritative. R1–R3 are planning stages, not application versions or configured GitHub Milestones.

**Accepted product baseline:** application 1.3.2 provides the multilayer atlas and 160-candidate AI radar, plus local following and the subscription/sample-brief framework. See the [reusable baseline](design/baselines/README.md) and [radar contract](docs/AI_RADAR.md). Paid service, Agent research, delivery and expanded evidence remain future work. See [the contract](docs/INTELLIGENCE.md), [delivery #14](https://github.com/X-lab2017/open-dipper/issues/14) and tasks [#15 sources](https://github.com/X-lab2017/open-dipper/issues/15), [#16 evidence](https://github.com/X-lab2017/open-dipper/issues/16), [#17 services](https://github.com/X-lab2017/open-dipper/issues/17), [#18 editorial](https://github.com/X-lab2017/open-dipper/issues/18), [#19 first content](https://github.com/X-lab2017/open-dipper/issues/19). Existing R1 gates remain open.

<!-- section:direction -->
## Direction

Build a trustworthy global AI and open-source intelligence observatory that people can use, inspect and improve. Preserve Map / Globe / Wire, the accepted visual baseline and one-screen / two-screen presentation. Extend data quality, reliability and participation around that product.

| User | Outcome to work toward |
| --- | --- |
| Researchers and ecosystem observers | Compare participation, contribution proxies and influence with visible scope, periods and original evidence |
| Community editors and domain experts | Propose useful sources and events, review accuracy and correct errors |
| Presenters and educators | Explain a reproducible view on a large screen and share its context |
| Developers and engineering agents | Pick up a bounded task with contracts, fixtures, checks and review evidence |

The current 20 repository samples and three trailing-year geography labels do not establish global coverage. Expanding coverage requires export evidence and definitions, not simply more map markers.

<!-- section:phases -->
## Three stages

| Stage | Main work | Exit evidence |
| --- | --- | --- |
| **R1 · Reliable foundations and participation** | Monthly regional contract and pilot specification; input validation and recovery; complete bounded editorial reads; source directory and terminology | #9–#13 acceptance met; reproducible fault/recovery checks; explicit source/coverage boundaries. Resolve applicable #6 rights decisions before inviting broad code reuse or publishing new data |
| **R2 · Evidence-backed data expansion** | Authorized monthly regional pilot, broader repository catalog, partitions and reusable source adapters; health/performance baseline; incremental module separation | A traceable real-data pilot passes contract and scope checks; unknowns and exclusions remain visible; measured data-volume/load results justify each expansion; adapters have replayable fixtures |
| **R3 · Analysis, sharing and recurring use** | Comparable region/project views, shareable view state, evidence-linked digests and presentation scenarios; evaluated AI assistance | A user can reproduce a shared view and trace its claims to sources/periods; representative research and presentation tasks pass review; any AI-assisted output remains attributable and correctable |

R1 reliability and entry tasks can run independently of real-data access. R2 real-data publication depends on an authorized export and an accepted contract. R3 comparisons depend on comparable R2 data; self-contained usability work can move earlier when its own acceptance is clear.

<!-- section:architecture -->
## How the framework should evolve

These are proposed additions to the [current architecture](docs/ARCHITECTURE.md), not capabilities already present.

| Area | Next boundary to strengthen | When to expand further |
| --- | --- | --- |
| Data | Separate monthly regional contracts from annual labels; validate producers and consumers; identify schema/source version, coverage and unknowns | Add catalog manifests and partitions after measuring an authorized pilot; never load all raw ecosystem activity into the browser |
| Events | Bounded, complete editorial pagination; source metadata, replayable adapters and explicit completeness/error states | Broaden official sources after quality/recovery checks; entity and geography links need evidence, not inferred headquarters |
| Frontend | Extract loading/validation, state/filter logic and panels incrementally while keeping current behavior and tokens | Use contract and browser acceptance to support parallel contributions; a visual redesign is not a prerequisite |
| Operations | Measure source success age, publication-to-collection delay, truncation, freshness and load cost | Consider object storage, workers, queues or a database only when measured limits or shared editorial needs justify an ADR and migration plan |
| Agent engineering | Keep briefs, fixtures, acceptance mapping and failure evidence easy to discover | Add focused dependency/contract checks for recurring failures; consider automated dispatch only after permissions, isolation, evaluation and recovery are specified |

Continue with static snapshots and Pages while they meet measured needs. Streaming, accounts, a shared editing backend and autonomous merging are not commitments in this roadmap. AI summaries, classifications and location suggestions should start as offline, evidence-linked evaluations with a human correction path.

<!-- section:first-tasks -->
## First work packages

All tasks below are scoped but unassigned at this baseline. Read their live state before starting. The suggested first engineering batch is **#9, #10 and #11**; **#12 and #13** are small community entry tasks. These are separate tasks, not a requirement to run multiple agents concurrently.

| Issue | Deliverable | Dependency / suitable contributor |
| --- | --- | --- |
| [#9 Monthly regional contract](https://github.com/X-lab2017/open-dipper/issues/9) | Schema proposal, explicit missing/unknown semantics, fixtures and pilot input checklist | Data maintainer + engineer/agent; synthetic fixtures can proceed, real ingestion awaits export evidence |
| [#10 Loading validation and recovery](https://github.com/X-lab2017/open-dipper/issues/10) | Validated boundaries, visible failure states and browser recovery evidence | TypeScript engineer/agent; no new upstream data needed |
| [#11 Editorial pagination](https://github.com/X-lab2017/open-dipper/issues/11) | Bounded issue/history reads, completeness gating and withdrawal/reapproval tests | Python engineer/agent; mock network responses, preserve approval rules |
| [#12 Source directory](https://github.com/X-lab2017/open-dipper/issues/12) | Readable inventory of the nine configured sources and a proposal example | First contribution; Markdown and source-document reading |
| [#13 Bilingual terminology](https://github.com/X-lab2017/open-dipper/issues/13) | Eight plain-language terms anchored to existing contracts | First contribution; documentation and translation review |

The larger tracks remain [#4 coverage](https://github.com/X-lab2017/open-dipper/issues/4), [#5 event quality](https://github.com/X-lab2017/open-dipper/issues/5) and [#6 rights](https://github.com/X-lab2017/open-dipper/issues/6). Completing a child task does not close an entire track. R2/R3 ideas become implementation issues only after their scope, inputs and acceptance are clear.

<!-- section:participation -->
## Join at the right level

- **Bring a need:** use the [feature form](https://github.com/X-lab2017/open-dipper/issues/new?template=feature_request.yml); describe a scenario and useful result. No engineering plan is required.
- **Offer evidence:** review source quality, metric interpretation, translation, accessibility or presentation behavior; comment on the relevant issue. Submit sourced events through the [editorial form](https://github.com/X-lab2017/open-dipper/issues/new?template=ecosystem-event.yml), which retains independent approval.
- **Take a task:** check for an active owner/PR, comment with a small proposed scope and follow the [contribution guide](CONTRIBUTING.md). #12 and #13 have `good first issue` / `help wanted` labels; those labels are contribution signals, not execution permissions.
- **Implement with an agent:** start at [AGENTS.md](AGENTS.md) and the [Harness workflow](docs/HARNESS.md). Maintainers decide direction and acceptance; authorized collaborators start execution. Opening an issue does not launch a background agent.

Maintainers keep task scope and review feedback in the issue, acknowledge proposed work when available and make the next step clear. Review availability is not yet a response-time SLA. Use a [versioned plan](docs/plans/README.md) for cross-module or multi-session work, and link the landed change and actual validation before closing.

<!-- section:decisions -->
## Inputs and decisions to resolve

| Input | Where to resolve it | Work that can proceed meanwhile |
| --- | --- | --- |
| Application/documentation license, contribution terms and separate brand/data rights | [#6](https://github.com/X-lab2017/open-dipper/issues/6) | Planning, evaluation and scoped work under existing authorization; no invented license grant |
| First monthly regional export: location/sample, fields, periods, population/unknowns and permitted use | [#9](https://github.com/X-lab2017/open-dipper/issues/9), then [#4](https://github.com/X-lab2017/open-dipper/issues/4) | Contract design and explicitly synthetic fixtures |
| Priority users, real scenarios and source coverage | [#8](https://github.com/X-lab2017/open-dipper/issues/8) and feature/source proposals | Current reliability and documentation tasks |
| Reviewer capacity and task ownership | Each implementation issue | Unassigned tasks remain discoverable; do not invent owners or deadlines |

<!-- section:scorecard -->
## Measure progress by outcomes

At each stage review, attach the data window, denominator and evidence. These are proposed measurements, not collected results or promised targets.

| Dimension | Evidence to collect |
| --- | --- |
| Coverage | Comparable platforms/entities/periods, known versus unknown geography, exclusions; report percentages only with a known denominator |
| Freshness | Per-source success age, publication-to-first-collection delay and failed/capped attempts over a stated window; separate collection from deployment delay |
| Correctness | Contract fixtures, missing/zero separation, complete-versus-partial reconciliation, recovery and provenance checks |
| Performance | Snapshot/partition bytes and browser startup/interaction results on stated device/network conditions; set budgets after measurement |
| Participation | Needs clarified, tasks completed with evidence, first contributions and review time; never treat issue/PR volume alone as impact |
| Usefulness | A researcher, editor or presenter can complete a representative task and explain what the result does and does not mean |

<!-- section:references -->
## Maintaining this roadmap

Update both language editions together when priorities or stage gates change. Keep task progress in issues, current facts in [STATUS](docs/STATUS.md), design reasons in [DECISIONS](docs/DECISIONS.md), and delivery evidence in [HISTORY](docs/HISTORY.md). Avoid duplicating mutable checklists across those pages.

References consulted on 2026-10-25: [OpenAI Harness engineering](https://openai.com/index/harness-engineering/), [GitHub contribution guidance](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github), and [CNCF newcomer issue guidance](https://contribute.cncf.io/projects/best-practices/templates/issue-labels/). The phases and priorities above are OpenDipper-specific recommendations based on its current source and contracts, not an external certification. AI assistance was used to inspect the repository, prepare task briefs and organize this roadmap.
