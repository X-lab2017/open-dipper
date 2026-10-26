# Accepted baseline: Atlas / Quiet Observatory 1.3.0

Recorded 2026-10-26 after maintainer acceptance. Application **1.2.0**, visual system **1.3.0**. This is a reusable design and interaction baseline, not a new application release or a new license.

- Accepted implementation: [7b27609](https://github.com/X-lab2017/open-dipper/commit/7b27609dd3d02ae12e6987c3c989f0a5a6da561c), delivered by [PR #25](https://github.com/X-lab2017/open-dipper/pull/25).
- Release receipt: [3dacbbd](https://github.com/X-lab2017/open-dipper/commit/3dacbbd8e74437315f844fad9c7f2d8d6f6ac3eb); [successful CI and Pages](https://github.com/X-lab2017/open-dipper/actions/runs/40261921471).
- [Machine-readable manifest](atlas-1.3.0.json) pins source files and SHA-256 fingerprints. Scheduled data refreshes may advance main without changing this accepted UI.
- [Current visual specification](../../docs/VISUAL_SYSTEM.md), [atlas behavior](../../docs/ATLAS_WORKSPACE.md), [verification record](../../docs/plans/atlas-release-v9.md).

## Reusable composition

| Slot | Baseline rule | Module-specific content |
| --- | --- | --- |
| Global shell | Product identity, five primary routes, theme/language, one/two screens, fullscreen and GitHub | Highlight the active route; do not replace global navigation |
| Context | Compact task/perspective selection and one evidence/freshness entry | Task filters and honest observation dates |
| Main canvas | Largest area, restrained grid and thin controls | Map/globe, radar, a chart or another suitable visualization |
| Side panels | Compact controls and one focused detail; tabs instead of stacked inspectors | Domain taxonomy, shortlist, evidence and actions |
| Secondary strip | Small and useful; no duplicate headings or decorative totals | Actual changes or a clearly identified demonstration |
| Detail state | Preserve selection and context, allow predictable return | Evidence, comparable metrics and next action |

The atlas has equal sidebars. Other modules may change their proportions to fit their content; reusing the baseline does not mean forcing every page into a map layout. Copy the [module design template](../../docs/templates/OBSERVATORY_MODULE.md) before adding a module.

## Keep these decisions

- Blue-gray surfaces and cyan/teal interaction tones, paired dark/light tokens; avoid a new purple accent palette. Use the existing type/spacing/border/focus tokens.
- Circular entities; area color, proportional bubble area and categorical dots have distinct meanings. Do not overload color or marker size with several measures.
- Short labels, aligned numbers, stable panel heights and restrained transitions. Do not hide important evidence or missing-data status to save space.
- Default atlas camera: geographic 10° E / 36° N, north-up. Map and globe retain equivalent selection/metric semantics. This is an atlas-specific rule, not a radar coordinate system.
- One-screen desktop, explicit two-screen presentation, natural flow on small screens. Keep module fullscreen separate from application fullscreen, with a visible return and Escape.
- Keyboard focus and touch alternatives; reduced-motion and hidden-tab behavior; no animation that implies an unobserved measurement.
- Preserve source dates and independent statistical windows. Missing is not zero; demonstration is not observation. A page refresh is not a data update.

## Reuse procedure

1. Start from the pinned source above when reproducing this exact baseline. Use current shared components when extending main; inspect changes since the pin.
2. Use `design/tokens.json`, `src/design/components.css` and existing brand helpers. Do not fork a page-local color system or hand-edit generated palettes.
3. Fill the module template with the user decision, visual encodings, data contracts, states and acceptance examples. Keep proposed behavior separate from production facts.
4. Run relevant checks from [DEVELOPMENT](../../docs/DEVELOPMENT.md). For visual work verify both themes, keyboard/touch, fullscreen return, narrow screens and reduced motion.
5. `npm run design:package` builds the portable visual ZIP, including this record, its manifest and `MODULE_TEMPLATE.md`. The bundle remains at the established download URL; the internal visual version identifies its contents.

The template is a design/engineering worksheet, not a standalone app scaffold. Source files and the existing design-system page are the executable examples. Application, data and brand permissions remain separate: see [RIGHTS](../../docs/RIGHTS.md). No third-party brand rights are granted by this baseline.
