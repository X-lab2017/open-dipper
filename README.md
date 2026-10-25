<!-- section:overview -->
# OpenDipper

**English** | [简体中文](README.zh-CN.md)

**A global observatory for the open-source ecosystem.** Explore monthly OpenDigger metrics and near-live ecosystem events through a map, globe and news wire.

[Open the observatory](https://www.x-lab.info/open-dipper/) · [Request a feature](https://github.com/X-lab2017/open-dipper/issues/new?template=feature_request.yml) · [Report a problem](https://github.com/X-lab2017/open-dipper/issues/new?template=bug_report.yml) · [Visual baseline](https://www.x-lab.info/open-dipper/design-system.html)

[![OpenDipper map view with geographic layers, compact navigation and an ecosystem event wire](docs/assets/open-dipper-map-2026-10-25.png)](https://www.x-lab.info/open-dipper/)

*Interface snapshot · 2026-10-25 · Chinese UI. Values and demo labels reflect the captured view, not live statistics. [See the visual evolution](docs/archive/2026-10-25-visual-evolution.md).*

<!-- section:business -->
## Business view

```mermaid
flowchart TD
  M["OpenDigger metrics and geography"] --> O["OpenDipper observatory"]
  E["Published and reviewed ecosystem events"] --> O
  D["Clearly labeled demo scenarios"] -.-> O
  O --> G["Place: map and globe"]
  O --> T["Time: rankings and trends"]
  O --> W["Events: wire and source evidence"]
  G --> V["Research · monitoring · presentations"]
  T --> V
  W --> V
  V -.-> I["Issues: needs and feedback"]
  I -.-> O
```

Observed data and demonstration scenarios remain separate throughout the product. Users explore the evidence and feed new needs back through issues.

<!-- section:collaboration -->
## Human direction, agent-led engineering

We build OpenDipper around **human needs, agent execution and verifiable outcomes**. People shape the product through issues and review the results. Agents are the primary engineering collaborators, working from versioned context to implement, test, document and refine changes. Human code contributions remain welcome.

| Participant | Main responsibility | Starting point |
| --- | --- | --- |
| Users and domain experts | Describe the scenario, desired outcome and what would make the result useful | [Submit a need](https://github.com/X-lab2017/open-dipper/issues/new?template=feature_request.yml) |
| Maintainers | Set priorities and scope, resolve product/data decisions, accept outcomes and govern releases | [Issues](https://github.com/X-lab2017/open-dipper/issues) and [contribution guide](CONTRIBUTING.md) |
| Engineering agents | Inspect context, plan, implement, verify, self-review and leave an evidence-backed handoff | [AGENTS.md](AGENTS.md) and [engineering workflow](docs/HARNESS.md) |

<!-- section:needs -->
## Have a need? Start with an issue

You do not need to know the code or design a technical solution. Tell us:

1. **Your situation:** who is using OpenDipper, and for what task?
2. **Your desired result:** what should become possible or easier?
3. **How you would judge it:** a useful example, observable result or screenshot, if available.

For example: “When presenting on a conference screen, I want the map and news wire to remain readable without scrolling; I can review the result at 1920×1080.” Maintainers and agents turn this into a scoped task and testable acceptance criteria.

Use the [bug form](https://github.com/X-lab2017/open-dipper/issues/new?template=bug_report.yml) for broken behavior. To contribute a sourced ecosystem publication, use the separate [event form](https://github.com/X-lab2017/open-dipper/issues/new?template=ecosystem-event.yml); editorial approval remains a separate process. Issues may be written in English or Chinese.

<!-- section:execution -->
## Agent engineering workflow

1. **Clarify the task:** link the issue, record the outcome, scope and acceptance criteria. Extend the existing issue; use an [engineering task](https://github.com/X-lab2017/open-dipper/issues/new?template=agent_task.yml) only when a separate implementation unit helps.
2. **Load the right context:** start at [AGENTS.md](AGENTS.md), then follow the [task index](docs/CONTEXT.json). For complex or multi-session work, keep a versioned [execution plan](docs/plans/README.md).
3. **Implement and check:** work within the agreed scope; reproduce failures, run relevant checks, inspect the result and fix failures before handoff.
4. **Deliver evidence:** submit a focused PR with acceptance results, actual test output, visual evidence where relevant, documentation updates and AI-work disclosure.
5. **Close the loop:** the maintainer reviews outcomes and release readiness. Record the result in the issue and preserve reusable lessons in contracts, tests or docs.

The full lifecycle and completion criteria are in [HARNESS.md](docs/HARNESS.md). Existing authorization determines which actions an agent may perform.

<!-- section:harness -->
## What the harness provides

Here, the *harness* is the context, tools, constraints and feedback that make engineering work repeatable.

| Layer | Repository mechanism |
| --- | --- |
| Context | Short [Agent entry](AGENTS.md), [architecture](docs/ARCHITECTURE.md), [decisions](docs/DECISIONS.md), task-specific reading paths |
| Constraints | [Data contracts](docs/DATA_CONTRACTS.md), [visual baseline](docs/VISUAL_SYSTEM.md), source provenance and generated-file ownership |
| Execution | Local development, reproducible commands, [plans](docs/plans/README.md) and [handoffs](docs/templates/HANDOFF.md) |
| Verification | Type checks, contract/behavior tests, visual resource checks, documentation checks and Chromium acceptance in [CI](.github/workflows/pages.yml) |
| Feedback | Issue → implementation → evidence → outcome review → updated repository knowledge |

**Current automation:** CI validates changes and publishes eligible main-branch builds. Authorized collaborators currently start agent work; opening an issue does not automatically launch an agent. An always-on issue dispatcher, automatic assignment and autonomous merge are not configured. See [the capability and evidence table](docs/HARNESS.md).

<!-- section:product -->
## Explore the observatory

- **Map / Globe / Wire:** geographic layers, located events, filters and source inspection. The map opens by default; the globe adds atmospheric lighting and inertial interaction.
- **Monthly analysis:** same-platform rankings, twelve-month trends, playback and local watchlists.
- **Presentation:** one-screen overview, two-screen analysis, fullscreen, responsive layout, English/Chinese and dark/light themes.
- **Reusable visual system:** X-lab official assets, shared CSS/Canvas tokens and a [downloadable baseline](https://www.x-lab.info/open-dipper/design-system.html).

| Data channel | Current scope | Cadence |
| --- | --- | --- |
| OpenDigger repository metrics | 20 curated repositories, 4 platforms, 6 metrics | Monthly |
| Geographic aggregates | Microsoft, Apache and PyTorch Foundation labels; independent trailing-year periods | Retrieved monthly |
| Ecosystem events | Selected GitHub releases, OpenSSF/CNCF RSS and approved editorial issues | Collection target: 30 minutes |
| Demonstration | 13 fictional located events and synthetic geographic metrics | Fixed fixtures, visibly identified |

These are **samples, not worldwide population totals**. Missing values stay missing; unknown locations stay unlocated. Annual geographic aggregates do not move with the repository month slider. The browser checks deployed event snapshots every five minutes; collection targets are not a real-time SLA. Definitions and limitations: [data contracts](docs/DATA_CONTRACTS.md).

<!-- section:architecture -->
## Technical architecture

```mermaid
flowchart TD
  OD["OpenDigger CDN"] --> C["Collectors: scripts in GitHub Actions"]
  FE["GitHub releases and official RSS"] --> C
  ED["Maintainer-approved event issues"] --> C
  C --> S["Observed JSON snapshots"]
  S --> Q["Validation and static build"]
  UI["TypeScript UI and shared design tokens"] --> Q
  FX["Fixed demo fixtures and map geometry"] --> Q
  Q --> A["Archive validated source snapshots in Git"]
  A --> P["Deploy static artifacts to GitHub Pages"]
  P --> B["Browser: map / globe / wire and analysis"]
```

This is the publication path on main. PRs validate without collecting, archiving data or deploying; scheduled builds skip browser acceptance. The browser loads published snapshots and has no write API or publishing token. Module responsibilities and failure behavior: [architecture](docs/ARCHITECTURE.md) and [operations](docs/OPERATIONS.md).

<!-- section:development -->
## Run locally

Use Node.js 24, npm and Python 3. After dependency installation, bundled snapshots support local development without upstream collection.

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

Task-specific checks and browser setup: [development guide](docs/DEVELOPMENT.md). Scheduled collection, manual event review, failure recovery and deployment: [operations](docs/OPERATIONS.md). Detailed analysis and the previous panorama remain tested compatibility routes.

<!-- section:documentation -->
## Documentation and roadmap

| Question | Read |
| --- | --- |
| What is available, verified or still missing? | [Current status and issue index](docs/STATUS.md) |
| How do I contribute or hand work to an agent? | [Contributing](CONTRIBUTING.md) · [Harness workflow](docs/HARNESS.md) |
| Where is the knowledge base? | [Documentation map](docs/README.md) · [Machine context](docs/CONTEXT.json) |
| Why did the product evolve this way? | [History](docs/HISTORY.md) · [Decisions](docs/DECISIONS.md) · [Changelog](CHANGELOG.md) |
| How do I reuse the visual system? | [Visual specification](docs/VISUAL_SYSTEM.md) · [Design resources](design/README.md) |
| What comes next? | [Full-coverage data #4](https://github.com/X-lab2017/open-dipper/issues/4) · [Event quality #5](https://github.com/X-lab2017/open-dipper/issues/5) · [License decision #6](https://github.com/X-lab2017/open-dipper/issues/6) |

README and contribution guides have English and Chinese editions. Deeper references currently use their maintained source language. Update both entry editions together; structural checks detect section/link drift, while contributors review translation meaning. Discovery endpoints: [llms.txt](https://www.x-lab.info/open-dipper/llms.txt) and [agent-context.json](https://www.x-lab.info/open-dipper/agent-context.json).

<!-- section:transparency -->
## Transparency and reuse

AI agents participated in the October 2026 implementation, visual iterations and documentation. Contributions disclose agent/tool involvement, verification and remaining uncertainty; there is no claim that every line is agent-written or independently human-reviewed. Our operating model adapts [Harness engineering](https://openai.com/index/harness-engineering/) to this repository; [HARNESS.md](docs/HARNESS.md) distinguishes enforced checks from process conventions and future capabilities.

OpenDipper is independently implemented. Spatial inspiration comes from [world-monitor.com](https://world-monitor.com/); engineering references include the separate [koala73/worldmonitor](https://github.com/koala73/worldmonitor) project. X-lab assets retain their [official provenance](public/brand/provenance.json), and dependencies retain [third-party notices](public/THIRD_PARTY_NOTICES.txt).

**License status:** an application-level LICENSE has not yet been selected. Application code, source data, map geometry and brand assets have distinct rights; public availability does not grant a blanket reuse license. See [rights status](docs/RIGHTS.md) and [decision #6](https://github.com/X-lab2017/open-dipper/issues/6).
