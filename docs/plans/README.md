# Execution plans

Use a versioned plan for a multi-session task, a data-contract migration, a multi-module architectural change or work with significant unresolved decisions. A small change only needs a brief/checklist in its issue or PR. Requesters describe needs; the implementing agent prepares the technical plan.

Copy [EXECUTION_PLAN.md](../templates/EXECUTION_PLAN.md) into this directory as `<issue-number>-<short-topic>.md`, fill it with the actual task context, and link it from the issue and PR. Do not commit an empty placeholder. For a task that has no issue yet, use a descriptive filename and add the issue link when available.

Keep the filename stable and update the plan's execution state (`active`, `blocked`, `completed` or `superseded`). GitHub issues remain the task-status authority; the plan stores detailed steps, checkpoints, decisions and evidence so another agent can resume. Completed plans stay in place for provenance and are not loaded for unrelated tasks. Superseded plans point to their replacement.

Update the plan at meaningful checkpoints, before a session handoff, or when scope changes. Completion records link the implementation and verified result; never mark pending CI/deployment as passed. Add the plan to the relevant task's context when it affects future work; do not grow AGENTS into a task log.

See [the lifecycle](../HARNESS.md), [development checks](../DEVELOPMENT.md) and [handoff template](../templates/HANDOFF.md).
