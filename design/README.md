# OpenDipper visual baseline — Quiet Observatory

The observation, interaction and evidence layers share one visual system. Preserve X-lab / OpenDipper brand assets; keep the observation canvas as the focus. This baseline changes presentation, not observations or geographic attribution.

## Source of truth

- `tokens.json`: paired dark/light surfaces, text, semantic colors, sequential map ramps, 18 layer tones and metric-to-ramp roles.
- `npm run design:build`: produces `src/design/palette.ts` and `src/design/theme.css`. Do not hand-edit generated files.
- `npm run design:check`: detects drift. Production builds run this check.
- `src/design/scales.ts`: logarithmic normalization, continuous stop interpolation and matching CSS legends. Canvas and legend consume the same stops.
- `src/design/components.css`: interaction states, map furniture, tables, dialogs and portal components. Existing presentation files own responsive layout, not new color definitions.

## Color roles

| Role | Dark | Light | Use |
| --- | --- | --- | --- |
| Page | `#0B1119` | `#EDF2F4` | Quiet background |
| Panel | `#121C27` | `#FBFDFC` | Information surfaces |
| Primary text | `#E2EBF0` | `#203540` | Names and main values |
| Secondary text | `#AEBFCB` | `#465E6B` | Labels and supporting copy |
| Muted text | `#8DA4B4` | `#566D79` | Dates, units and metadata |
| Interaction accent | `#87C6DB` | `#28677E` | Selection, navigation, focus |
| Project influence | Blue-green ramp | Blue-green ramp | Regional quantitative data |
| Model assets | `#E0C68E` | `#856525` | Proportional-area bubbles |

Area metrics use blue, teal or blue-green sequential ramps with monotonic luminance. Higher values brighten the dark map and deepen the light map. Unknown regions remain a distinct gray; they are never encoded as zero. No HSL hue shortcuts or violet fill palettes.

Entity categories use restrained paired tones. Circles, dashed rings, center dots and tooltips supplement color. Bubble area remains proportional to quantity. A thin backdrop stroke separates markers from varying map fills; it does not change encoded area. UI selection always uses the interaction accent rather than filling tabs with layer colors.

## Map and globe

- Same metric, normalization, ramp, layer order and legend in both views.
- Globe lighting is decorative and not a quantitative scale. Reduce shadow, dot texture and atmosphere strength so they support data readability.
- Graticules, borders and camera readouts remain subordinate to observations. Tooltips and controls use theme-aware surfaces.
- Simulated pulse colors use the current theme for both HTML and canvas. Keep simulation/forecast context available in metric details and concise in-place labels.
- Preserve independent map fullscreen, persistent return control and Escape. Locating an entity preserves the current map/globe mode.

## Component and motion rules

Use thin borders, moderate corner radii and restrained shadows. Keep fixed layouts and numeric widths stable; do not make counters or hover states shift surrounding content. Text labels identify metrics; color does not replace names. Surface hover, checked state, focus ring and disabled state have separate treatments.

Layer help appears on hover, keyboard focus or touch devices. At the top of the point stack, Move up is disabled; moving a point skips area and bubble entries. Avoid repeated headings, geometry summaries, source links and review labels. Keep original evidence and essential uncertainty information accessible.

Honor reduced motion, retain keyboard navigation and stop offscreen animations. Do not add decorative effects that compete with the data or imply measurement.

## Verification and extension

`npm test` checks nominal text/action/layer/pulse colors at 4.5:1 or better against paired panel/page/input surfaces, monotonic ramp luminance, shared map/legend stops, missing-value semantics and point-stack ordering. This is a focused regression check, not a claim of complete accessibility certification.

When adding a layer, assign it a semantic tone in `tokens.json`, regenerate, and check map + globe in both themes. Do not assign a new saturated color simply because the layer is new. Keep distinctions meaningful and test overlapping layers as well as isolated examples.

See [visual specification](../docs/VISUAL_SYSTEM.md) and [release plan and validation](../docs/plans/atlas-release-v9.md).
