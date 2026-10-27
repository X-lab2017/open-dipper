# OpenDipper milestone film · v2

**50 seconds · 1920 × 1080 · 30 fps · H.264 / AAC.** A product introduction, not an operation tutorial. Chinese main copy, English supporting lines, original synthesized electronic music; no narration. Produced with AI assistance on 2026-10-27 against published application 1.6.0.

The complete MP4, cover and standalone source ZIP are delivered to the maintainer as versioned files. Large movie exports stay out of Git; the renderer, facts, captions and notices here make the film reproducible. No social post or paid promotion is implied by this delivery.

## Storyboard

| Time | Scene | Visual and meaning |
| --- | --- | --- |
| 00–04 | 开源世界，正在连接 | Decorative network, not measured activity |
| 04–08 | 开源北斗 OpenDipper | Official wordmark; AI and open-source observatory |
| 08–15 | 全球观测 | Actual dark/light 1.6.0 map and inspector; 246 countries and regions in the upstream summary, eighteen application layers |
| 15–23 | AI 雷达 | Dense conceptual scan; 1.94 亿 developers, 3.81 亿 repositories, 96.52 亿 logs from the global-observatory upstream summary; visible full-domain-preview and staged-integration labels |
| 23–31 | 开源星系 | Actual dark/light dual-network view; 19,771 code repositories and 24,000 model/data/Space nodes |
| 31–38 | 环球巡航 | Five ordered panels, actual flat-map and company-stop globe captures |
| 38–44 | 发现、连接、导出 | Conceptual task cards; Markdown / HTML / JSON outputs |
| 44–50 | 试用与反馈 | Preview 1.6.0, public site and repository; user feedback is welcome in [#35](https://github.com/X-lab2017/open-dipper/issues/35) |

## Data claims and limits

The radar scene replaces v1's 80 / 60 / 20 sample-count story with the **global data foundation** requested by the maintainer. Its three totals are exact source values rounded for display, recorded in [facts.json](facts.json) and checked against [dashboard-overview.json](../../public/data/dashboard-overview.json) when rendering. The source update is **2026-10-08**, repository check **2026-10-26**, cumulative snapshot **2026 Q2**. They are not the number of records currently searchable in the radar, locally ingested data, live activity, or a throughput claim. The current radar contains 160 sourced identities; full-domain integration remains future work.

The 520 decorative radar points do not individually represent source entities. Network particles, transitions and card diagrams are conceptual. The 12,840 simulated intelligence inventory, pulse growth and projected 2026 commit total are excluded from headline claims. Real screenshots retain their own simulation labels. Galaxy data retains code window 2025.08–2026.07 and model snapshot 2026-08-05. See the [milestone scope table](../../docs/releases/1.6.0.md) and [image manifest](../../docs/assets/manifest.json).

## Reproduce

From this repository's root, install Python dependencies from a trusted package environment and ensure `ffmpeg` / `ffprobe` are on PATH. The tested environment versions are in [environment.txt](environment.txt). The film adds no frontend dependencies.

```sh
python3 -m pip install -r media/promo/requirements.txt
python3 media/promo/render.py --preview --audio
python3 media/promo/render.py --render
ffmpeg -v error -i media/promo/output/OpenDipper-Promo-v2-1080p.mp4 -f null -
```

The renderer uses Noto Sans CJK SC and DejaVu Sans. Set `OD_FONT_ZH`, `OD_FONT_EN` and `OD_FONT_BOLD` to local font files if the defaults differ. Fonts are not bundled. Outputs are ignored in Git. `--preview` writes eight representative PNG frames, a contact sheet and a cover; inspect both theme variants as well as all scenes. `--audio` regenerates the original deterministic soundtrack. Changing duration requires regenerating audio too. [captions.srt](captions.srt) preserves the bilingual storyboard; essential scope qualifiers are also visible in-frame.

For the standalone source ZIP, retain the repository-relative paths used by the renderer: `media/promo/`, the seven current JPEGs in `docs/assets/`, `public/data/dashboard-overview.json`, `public/brand/XlabAI_Horizontal_ColorDark.svg` and `public/brand/opendipper/opendipper-horizontal-dark.svg`, plus applicable brand/data notices. A source package contains no node_modules, Git metadata, credentials, private conversation or previous rendered movies.

## Attribution, process and review

The maintainer supplied direction and approved the application structure and publication. Codex (AI) adapted the previous deterministic film, wrote copy and source checks, captured production UI, compressed images, synthesized music, rendered the output and reviewed representative frames and complete decode results. This is AI self-review, not independent human acceptance or a claim of manual verification of all upstream data. [validation.json](validation.json) records the measured output and hashes after rendering.

The film retains the original Amicro motion reference from [Subhan-code/Amicro--Micro-transitions-](https://github.com/Subhan-code/Amicro--Micro-transitions-) at commit `5a037fc0bfb538bdf3c634a64bdb12022ea13282`: TextReveal easing `[0.16, 1, 0.3, 1]` and smooth spring `(220, 24, 1)`. Source excerpts and MIT notice are in [notices/Amicro-LICENSE.txt](notices/Amicro-LICENSE.txt), [TextReveal](notices/Amicro-TextReveal.tsx) and [presets](notices/Amicro-presets.ts). No Amicro backend, application dependency or artwork was imported. The music is synthesized from original notes and noise, with no sampled recording or voice imitation.

OpenDipper and X-lab official SVGs are used unchanged. Application, data, geometry and branding have distinct rights; see [RIGHTS](../../docs/RIGHTS.md), [X-lab notice](../../public/brand/NOTICE.md), [upstream notice](../../public/brand/UPSTREAM_NOTICE.md) and [OpenDipper identity provenance](../../public/brand/opendipper/README.md). Root application licensing remains undecided; the Amicro notice grants no license to the whole film or repository.
