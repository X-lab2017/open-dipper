# OpenDipper product film · v4

**58 seconds · 1920 × 1080 · 30 fps · H.264 / AAC.** Product introduction, not an operation tutorial. Chinese main copy, English supporting lines, original synthesized electronic music, no narration. Updated with AI assistance on 2026-10-28 for application **1.15.1** and its five-module product loop.

The MP4, cover and standalone source ZIP are delivered as files. Large movie exports stay out of Git; renderer, compressed release screenshots, facts, captions and notices remain reproducible here. Delivery does not publish a social post or paid promotion.

## Storyboard

| Time | Scene | Visual and meaning |
| --- | --- | --- |
| 00–03 | 开源世界，正在连接 | Brief brand opening with decorative network |
| 03–10 | 平台总览 | Maintainer-provided dark Community hero: mission and four connected product modules before details |
| 10–17 | 全球观测 | Dark release screenshot; upstream coverage and eighteen layers |
| 17–24 | AI 雷达 | Global foundation totals with full-domain preview and staged-integration qualifiers |
| 24–31 | 开源星系 | Dark network screenshot; 19,771 code and 24,000 model/data/Space nodes |
| 31–43 | Agent 情报室 | Reading → knowledge → research, with a soft reading/report crossfade; six-source vLLM / SGLang editorial case |
| 43–52 | 共建社区 | Maintainer-provided “北斗的下一颗星，也许来自你” screenshot; feedback, evidence and development participation |
| 52–58 | 试用与反馈 | Site/repository and invitation; six seconds for the closing action |

## Data and capability boundaries

The radar headline figures use the **global data foundation**, not its current 160 sourced identities. Exact source values and display rounding are recorded in [facts.json](facts.json) and checked against [dashboard-overview.json](../../public/data/dashboard-overview.json) on render. Source update: **2026-10-08**; underlying repository check: **2026-10-26**; cumulative snapshot: **2026 Q2**. These are not local ingestion totals, live activity, radar search coverage or throughput. Full-domain integration remains future work.

The 520 decorative radar points do not correspond individually to entities. Network particles and transitions are conceptual. Simulated intelligence inventory, pulse growth and projected commit totals are excluded. Screenshots retain their original scope labels. Galaxy data retains code window 2025.08–2026.07 and model snapshot 2026-08-05.

The vLLM / SGLang report is an **editorial demonstration**, not DSH output or measured performance. Sources have references; citations do not establish independent verification. Knowledge remains browser-local; the actual Agent execution service is not connected. Community collaboration is an invitation, not an existing autonomous research service. See [workflow](../../docs/INTELLIGENCE_WORKFLOW.md) and [community contract](../../docs/COMMUNITY_HUB.md).

## Reproduce

Use Python 3, dependencies in [requirements.txt](requirements.txt), and ffmpeg/ffprobe. Tested versions are in [environment.txt](environment.txt). No frontend dependencies were added.

```sh
python3 -m pip install -r media/promo/requirements.txt
python3 media/promo/render.py --preview --audio
python3 media/promo/render.py --render
ffmpeg -v error -i media/promo/output/OpenDipper-Promo-v4-1080p.mp4 -f null -
```

Noto Sans CJK SC and DejaVu Sans are used, not bundled. Override `OD_FONT_ZH`, `OD_FONT_EN`, `OD_FONT_BOLD` for local font paths. `--preview` writes eight scene samples, contact sheet and cover; `--audio` regenerates the deterministic original soundtrack. Duration and transition timing changed in v4, so regenerate audio. [captions.srt](captions.srt) provides timed bilingual copy; essential qualifications are also burned into the video.

Standalone source ZIP retains `media/promo/` (excluding output), `public/data/dashboard-overview.json`, the two SVG paths referenced by the renderer, and applicable brand/data notices. It excludes dependencies, Git metadata, credentials and old movie exports.

## Process, rights and evidence

[assets.json](assets.json) records four dark release-source screenshots and two maintainer-provided dark screenshots, with dimensions, hashes and provenance. Release screenshots are Chromium acceptance captures at the repository subpath; the two new inputs are supplied by the maintainer. JPEG compression and video framing do not alter labels or data. All screenshots in v4 use dark mode; the old light screenshot is no longer loaded or packaged. The knowledge-workspace test screenshot containing security-test text was excluded; the film uses the clean reading and report screens. Capture date is not a data observation period.

AI assistance covered script, motion, screenshot selection, compression, original music synthesis, rendering and representative-frame review. Complete video/audio decode and measured metadata are in [validation.json](validation.json). This is AI self-review, not independent human acceptance.

The Amicro reference remains [Subhan-code/Amicro--Micro-transitions-](https://github.com/Subhan-code/Amicro--Micro-transitions-) at commit `5a037fc0bfb538bdf3c634a64bdb12022ea13282`: TextReveal easing `[0.16, 1, 0.3, 1]`, smooth spring `(220, 24, 1)`. Excerpts and MIT notice remain in [notices/Amicro-LICENSE.txt](notices/Amicro-LICENSE.txt), [TextReveal](notices/Amicro-TextReveal.tsx), [presets](notices/Amicro-presets.ts). No Amicro backend or artwork was imported. Music uses original notes/noise, no sampled recording or voice imitation.

Official X-lab and OpenDipper SVGs remain unchanged. Code, data, geometry and branding have separate rights; root application licensing remains undecided. See [RIGHTS](../../docs/RIGHTS.md), [X-lab notice](../../public/brand/NOTICE.md), [upstream notice](../../public/brand/UPSTREAM_NOTICE.md), [identity provenance](../../public/brand/opendipper/README.md). Amicro's license does not license the whole film or project.

## v4 review changes

Maintainer requested dark-only screenshots, overview before individual modules, a distinct Community participation scene and a runtime below one minute. v4 replaces the standalone logo chapter with a seven-second overview; identity remains in the opening and close. Total duration is 58 seconds, scene crossfades 0.35 seconds, and reading-to-report crossfade 0.55 seconds. Music and bilingual captions were retimed. Historical v3 measurements are retained in `validation-v3.json`; current measured output is `validation.json`. No website code or source dataset changes.
