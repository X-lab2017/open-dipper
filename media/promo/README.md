# OpenDipper product film · v3

**60 seconds · 1920 × 1080 · 30 fps · H.264 / AAC.** Product introduction, not an operation tutorial. Chinese main copy, English supporting lines, original synthesized electronic music, no narration. Updated with AI assistance on 2026-10-27 for application **1.15.1** and its five-module product loop.

The MP4, cover and standalone source ZIP are delivered as files. Large movie exports stay out of Git; renderer, compressed release screenshots, facts, captions and notices remain reproducible here. Delivery does not publish a social post or paid promotion.

## Storyboard

| Time | Scene | Visual and meaning |
| --- | --- | --- |
| 00–04 | 开源世界，正在连接 | Decorative network; not measured activity |
| 04–08 | 开源北斗 OpenDipper | Official wordmark; AI and open-source intelligence platform |
| 08–16 | 全球观测 | Dark/light release screenshots; 246 countries and regions in the upstream summary; eighteen application layers |
| 16–24 | AI 雷达 | Conceptual scan with global-observatory upstream totals: 1.94 亿 developers, 3.81 亿 repositories, 96.52 亿 logs; full-domain preview and staged-integration qualifiers remain visible |
| 24–32 | 开源星系 | Release network screenshot; 19,771 code repositories and 24,000 model/data/Space nodes |
| 32–45 | Agent 情报室 | 情报浏览 → 知识整理 → 深度研究; real reading/report surfaces and six-source vLLM / SGLang editorial case; no live Agent or benchmark claim |
| 45–54 | 共建社区 | Actual About page: mission, roadmap, real needs, evidence and contribution paths |
| 54–60 | 试用与反馈 | Preview 1.15.1, site and repository; feedback in [#35](https://github.com/X-lab2017/open-dipper/issues/35) |

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
ffmpeg -v error -i media/promo/output/OpenDipper-Promo-v3-1080p.mp4 -f null -
```

Noto Sans CJK SC and DejaVu Sans are used, not bundled. Override `OD_FONT_ZH`, `OD_FONT_EN`, `OD_FONT_BOLD` for local font paths. `--preview` writes eight scene samples, contact sheet and cover; `--audio` regenerates the deterministic original soundtrack. Duration and transition timing changed in v3, so regenerate audio. [captions.srt](captions.srt) provides timed bilingual copy; essential qualifications are also burned into the video.

Standalone source ZIP retains `media/promo/` (excluding output), `public/data/dashboard-overview.json`, the two SVG paths referenced by the renderer, and applicable brand/data notices. It excludes dependencies, Git metadata, credentials and old movie exports.

## Process, rights and evidence

[assets.json](assets.json) records six compressed release-source screenshots, dimensions, hashes, reviewed commit and CI artifact. These are Chromium acceptance captures at the repository subpath, not a manual live-site recording. JPEG conversion changes compression only. The knowledge-workspace test screenshot containing security-test text was excluded; the film uses the clean reading and report screens. Capture date is not a data observation period.

AI assistance covered script, motion, screenshot selection, compression, original music synthesis, rendering and representative-frame review. Complete video/audio decode and measured metadata are in [validation.json](validation.json). This is AI self-review, not independent human acceptance.

The Amicro reference remains [Subhan-code/Amicro--Micro-transitions-](https://github.com/Subhan-code/Amicro--Micro-transitions-) at commit `5a037fc0bfb538bdf3c634a64bdb12022ea13282`: TextReveal easing `[0.16, 1, 0.3, 1]`, smooth spring `(220, 24, 1)`. Excerpts and MIT notice remain in [notices/Amicro-LICENSE.txt](notices/Amicro-LICENSE.txt), [TextReveal](notices/Amicro-TextReveal.tsx), [presets](notices/Amicro-presets.ts). No Amicro backend or artwork was imported. Music uses original notes/noise, no sampled recording or voice imitation.

Official X-lab and OpenDipper SVGs remain unchanged. Code, data, geometry and branding have separate rights; root application licensing remains undecided. See [RIGHTS](../../docs/RIGHTS.md), [X-lab notice](../../public/brand/NOTICE.md), [upstream notice](../../public/brand/UPSTREAM_NOTICE.md), [identity provenance](../../public/brand/opendipper/README.md). Amicro's license does not license the whole film or project.
