# 开源北斗 OpenDipper · Brand assets 1.1

Production identity based on the approved 2026-10-25 concept: **seven-star network + open orbit + direction star**. These SVGs are newly constructed, clean geometric vectors with newly typeset outlined lettering, not a claim to recover original vector paths from the raster review. The approved review boards are preserved separately in [the design reference archive](https://github.com/X-lab2017/open-dipper/blob/main/docs/assets/brand-reference/README.md).

## Choose an asset / 选择资产

- `horizontal`: 中文“开源北斗”与 OpenDipper 双语横版，网站中文顶栏、封面、演示。
- `english`: OpenDipper 单行横版，小图标与清晰字标的导航比例，适用于中英文紧凑顶栏和对外材料；中文身份可保留在可访问名称和页面文字中。
- `stacked`: 竖版组合，方形海报、封面与较宽留白布局。
- `icon`: 完整七星图标，建议显示宽度 ≥ 48 px。
- `small`: 16–32 px 简化开放轨道与方向星，用于 favicon；不强行显示七星细节。
- `dark` 为深背景版，`light` 为浅背景版；`black` / `white` 为纯黑/纯白单色版。
- SVG 无外部字体或图片依赖，文字已转轮廓；同名 `@2x.png` 为透明背景 PNG。
- `favicon.ico` 含 16/32/48 px；`favicon-16.png` / `favicon-32.png` 及 `apple-touch-icon.png` 可直接用于网站。
- 可下载 `opendipper-brand-v1.zip`，内含全部 SVG、PNG、favicon、manifest 与本规范。ZIP 是构建输出，不在 Git 中重复存储。

## Usage / 使用规范

等比缩放，不裁切、不拉伸、不增加阴影或改动七星连线。安全区至少保留完整图标宽度的 1/10；双语横版建议宽度 ≥ 180 px，正式展示材料建议 ≥ 240 px。紧凑顶栏优先使用单行 `english` 版本，建议宽度 ≥ 150 px；不要把双语两行压缩到难以阅读。标准图标保持七个圆节点与一个独立四角方向星；方向星不是第八个网络节点。简化版只在小尺寸使用。

深背景建议 `#080D15` 或 `#101823`；冰蓝 `#69B9E9`、浅背景蓝 `#17638E`、浅色文字 `#E5EDF5`、方向星绿 `#9AD744`。绿色只作少量方向强调，不替代数据语义色。

与 X-lab AI 联合展示时，以细分隔线区分实验室品牌和产品标志，保持各自安全区。不得重绘、替换、变色或合并 X-lab 官方标志。X-lab 上游原文件及声明仍在父目录。

## Spacing revision 1.1 / 间距基线

2026-10-26，根据维护者提供的原双语图与紧凑导航图调整留白。七星、轨道、方向星和现有色值不变；同名 SVG/PNG 已替换，下载路径仍稳定。

- 双语横版保持 `1040 × 320`，文字区从原约 x=445 后移到 x=475；中文与英文使用分开的基线，实际轮廓之间约 40 个 viewBox 单位的净空，消除上下贴靠。
- 单行横版同为 `1040 × 320`，图形以 `0.6` 等比缩放，与更清楚的 OpenDipper 字标配合；图文之间保留约 65 个单位净空。
- 竖版调整为 `600 × 580`，增加上下组合与双语两行的呼吸空间。
- 中文和英文字形分别增加轻量字距；字体继续转轮廓，不要求页面加载字体。精确坐标、基线、字距及生成字体指纹记录在 `manifest.json`。
- 完整 `icon`、简化 `small` 与 favicon 的图形保持原样；品牌版本更新不改变图层颜色、交互主题或 X-lab 标志。

## Provenance and rights / 来源与权利边界

- Product design: user-approved OpenDipper concept; AI-assisted geometric production and web integration, 2026-10-25.
- Spacing and navigation lockup revision: maintainer-requested, AI-assisted SVG typography/layout adjustment, 2026-10-26. The accepted seven-star symbol is preserved.
- Chinese outlines: Noto Sans CJK SC Bold (SIL Open Font License 1.1), [upstream](https://github.com/notofonts/noto-cjk).
- Latin outlines: DejaVu Sans Bold ([font license](https://dejavu-fonts.github.io/License.html)). No font software is bundled.
- The fixed brand artwork is an identity asset. This package does **not** grant a new trademark endorsement or blanket license, nor does it change the repository's still-undecided application license. See [rights](https://github.com/X-lab2017/open-dipper/blob/main/docs/RIGHTS.md).
- `scripts/build-brand.py` documents reproducible geometry, outline generation and optional raster export. It is optional development tooling (Python fontTools and the named fonts; CairoSVG/Pillow for `--raster`); normal web build uses the committed SVG/PNG files and Python's standard-library ZIP writer only.

```sh
python3 scripts/build-brand.py --zh-font /path/to/NotoSansCJKsc-Bold.otf --raster
node --test tests/design.test.mjs
npm run design:package
```

An installed Noto Sans CJK Bold TTC can also be used (SC face index 2). Font software is not bundled. `--raster` refreshes all transparent `@2x.png` variants and favicon derivatives so reusable assets stay aligned with the SVG source.
