# Intelligence visual lenses · 1.8.0

2026-10-27. Maintainer requests implementation and official Pages publication after verification. Preserve all modules, category summaries, progressive feed, original evidence clocks and source/demo separation.

References inspected: microsoft/timelinestoryteller README and src/configurableTL.js (faceted/segmented layouts, chronological and radial representations, recorded scenes); LearnPrompt/ai-news-radar README and index.html (single taxonomy, day grouping, source-preserving stories). Timeline Storyteller is archived and uses D3 3 / Webpack 2. Implement original lightweight SVG/CSS/TypeScript; no upstream code, icons, feeds, skills or AI ranking services copied or installed.

Outcome: a compact visual discovery stage above the existing stream: temporal swimlanes, topic radar, and manual thematic story steps. Shared filters, source/demo counts, selectable clusters and contextual research starters. Default window is the most recent 30 days relative to the loaded archive, not a live claim; full archive is available. Index counts do not measure attention or causality; clustering is exact date/category/topic grouping, not semantic same-event deduplication.

Acceptance: deterministic bucket membership and totals, explicit capture-date treatment, accessible keyboard chart selection, selection intersects current filters, clear/reset, research source transfer, empty/error states, dark/light/EN/mobile/reduced motion, all original browser regression suites. No collector/workflow/permissions changes.

AI-assisted design, implementation and verification by Codex. Execution receipt in the release PR; user evaluates usefulness after release.
