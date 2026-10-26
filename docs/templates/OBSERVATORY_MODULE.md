# Observatory module design template

Template only. Copy into a task-specific design document; replace placeholders before submitting a proposal. Reuse [Observatory + AI radar 1.3.2](../../design/baselines/observatory-radar-1.3.2.md) and the current shared visual source. This worksheet does not authorize implementation or publication.

## 1. Outcome and status

- Module / owner / issue / baseline commit:
- Status: proposed / approved for implementation / implemented / superseded
- Primary user and concrete question:
- Useful result the user takes away:
- In scope / later / deliberately excluded:

## 2. User path

Describe one complete journey: arrive with a task → narrow candidates → inspect evidence → compare → take an action → return to changes. Specify the default state and the empty state. Keep the first screen focused on one decision.

## 3. Shared shell and page slots

| Slot | What this module puts here | Behavior and evidence |
| --- | --- | --- |
| Global navigation | Five established destinations | Active destination, keyboard and return behavior |
| Context / filters | Task first; show only supported filters | Clear selection, reset, URL/local state scope |
| Main visualization | Meaning of position, shape, color and size | Linked accessible list, meaningful default |
| Focused inspector | One entity or one comparable group | Tabs, missing facts, evidence and next step |
| Changes / second screen | Relevant changes or deeper analysis | Dates, pagination, no fabricated freshness |

Do not duplicate atlas totals on every page. Start with the shared sidebar width and segmented controls; change proportions only when the task requires it. The main visualization remains dominant. Preserve one/two-screen, dark/light, Chinese/English and small-screen flows.

## 4. Data and editorial contract

| Entity / metric | Identity and version | Source and permission | Observation window / refresh | Missing / stale / demo |
| --- | --- | --- | --- | --- |
| Fill with actual evidence | Stable upstream ID | Pinned URL or snapshot | Distinguish publication, capture and review | Explicit rendering |

Separate source facts, calculated values and reviewed opinions. Define inclusion/exclusion, deduplication, denominators, comparable groups and evidence links. Do not derive quality from popularity or infer relationships from co-occurrence. State which proposed filters/actions are currently unsupported.

## 5. States and interactions

- Loading, partial, unavailable, stale, empty and unreviewed states.
- Selection, multi-selection/comparison limits, filter conflicts, reset and deep links.
- Focus order, touch alternative, accessible list, contrast and reduced motion.
- One usage guide and one catalog-level sources entry; retain candidate-level evidence.
- Fullscreen/expanded-view ownership; selection must preserve the view, with visible return, Escape and focus restoration. Test narrow/short displays.
- Animation meaning and pause behavior; preserve selections while new records arrive.
- Security: untrusted source content, safe URLs, no client secrets, independent editorial approval.

## 6. Sustainability and action

Define public value first. If relevant, specify optional subscription value and downstream resource links. Paid placement must not change measurements or editorial judgments. Describe planned services as planned until authentication, delivery and entitlements exist.

## 7. Acceptance and handoff

| User outcome | Observable acceptance | Data/visual test | Actual result |
| --- | --- | --- | --- |
| Fill with a meaningful journey | Concrete example | Appropriate check | Not run / evidence |

Record dependencies, unresolved decisions, phased work and review questions. A proposal is not implementation; a build is not browser acceptance; a local check is not deployment. Add task-specific context to `docs/CONTEXT.json`, run `docs:build` and `docs:check`, and disclose AI-assisted scope and verification.
