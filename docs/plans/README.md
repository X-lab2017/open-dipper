# Execution plans

Use a versioned plan for a multi-session task, a data-contract migration, a multi-module architectural change or work with significant unresolved decisions. A small change only needs a brief/checklist in its issue or PR. Requesters describe needs; the implementing agent prepares the technical plan.

Copy [EXECUTION_PLAN.md](../templates/EXECUTION_PLAN.md) into this directory as `<issue-number>-<short-topic>.md`, fill it with the actual task context, and link it from the issue and PR. Do not commit an empty placeholder. For a task that has no issue yet, use a descriptive filename and add the issue link when available.

Keep the filename stable and update the plan's execution state (`active`, `blocked`, `completed` or `superseded`). GitHub issues remain the task-status authority; the plan stores detailed steps, checkpoints, decisions and evidence so another agent can resume. Completed plans stay in place for provenance and are not loaded for unrelated tasks. Superseded plans point to their replacement.

Update the plan at meaningful checkpoints, before a session handoff, or when scope changes. Completion records link the implementation and verified result; never mark pending CI/deployment as passed. Add the plan to the relevant task's context when it affects future work; do not grow AGENTS into a task log.

See [the lifecycle](../HARNESS.md), [development checks](../DEVELOPMENT.md) and [handoff template](../templates/HANDOFF.md).


## Current handoff and completed records

Read a plan only for the task it describes. Product work starts from the current module contract, not an unfinished step copied from historical review.

| Plan | Disposition |
| --- | --- |
| [Repository/community baseline #30](30-community-baseline.md) | Completed; merged by PR #31, CI/Pages and cleanup receipts in issue #30 |
| [Radar finishing 1.3.2](ai-radar-finish-v3.md) | Completed and published; current accepted radar behavior |
| [Radar density 1.3.1](ai-radar-density-v2.md) | Completed; retained as the density/numbering decision record |
| [Radar implementation 1.3.0](ai-radar-implementation.md) | Completed; original data/interaction delivery |
| [Radar design and atlas pin](ai-radar-design.md) | Design completed; review questions superseded by the implemented radar |
| [Atlas release](atlas-release-v9.md) | Completed; accepted map integration and publication evidence |
| [Initial workspace #24](24-observation-workspace.md) | Completed; UI superseded by atlas, evidence adapter retained |
| [Observation design #22](22-observation-layers.md) | Design completed; original UI proposal superseded, remaining source/entity scope in #22 |
| [Observed evidence #20](20-evidence-data.md) | Completed source-adapter delivery; independent data windows still apply |
| [Intelligence portal](intelligence-portal.md) | Completed framework delivery; service and evidence tasks remain separate |
