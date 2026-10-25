# 开源北斗 OpenDipper · Brand assets 1.0

Production identity based on the approved 2026-10-25 concept: **seven-star network + open orbit + direction star**. These SVGs are newly constructed, clean geometric vectors with newly typeset outlined lettering, not a claim to recover original vector paths from the raster review. The approved review boards are preserved separately in [the design reference archive](https://github.com/X-lab2017/open-dipper/blob/main/docs/assets/brand-reference/README.md).

## Choose an asset / 选择资产

- `horizontal`: 中文“开源北斗”与 OpenDipper 双语横版，网站中文顶栏、封面、演示。
- `english`: OpenDipper 英文横版，英文顶栏和对外材料。
- `stacked`: 竖版组合，方形海报、封面与较宽留白布局。
- `icon`: 完整七星图标，建议显示宽度 ≥ 48 px。
- `small`: 16–32 px 简化开放轨道与方向星，用于 favicon；不强行显示七星细节。
- `dark` 为深背景版，`light` 为浅背景版；`black` / `white` 为纯黑/纯白单色版。
- SVG 无外部字体或图片依赖，文字已转轮廓；同名 `@2x.png` 为透明背景 PNG。
- `favicon.ico` 含 16/32/48 px；`favicon-16.png` / `favicon-32.png` 及 `apple-touch-icon.png` 可直接用于网站。
- 可下载 `opendipper-brand-v1.zip`，内含全部 SVG、PNG、favicon、manifest 与本规范。ZIP 是构建输出，不在 Git 中重复存储。

## Usage / 使用规范

等比缩放，不裁切、不拉伸、不增加阴影或改动七星连线。安全区至少保留完整图标宽度的 1/10；双语横版建议宽度 ≥ 120 px，正式展示材料建议 ≥ 240 px。标准图标保持七个圆节点与一个独立四角方向星；方向星不是第八个网络节点。简化版只在小尺寸使用。

深背景建议 `#080D15` 或 `#101823`；冰蓝 `#69B9E9`、浅背景蓝 `#17638E`、浅色文字 `#E5EDF5`、方向星绿 `#9AD744`。绿色只作少量方向强调，不替代数据语义色。

与 X-lab AI 联合展示时，以细分隔线区分实验室品牌和产品标志，保持各自安全区。不得重绘、替换、变色或合并 X-lab 官方标志。X-lab 上游原文件及声明仍在父目录。

## Provenance and rights / 来源与权利边界

- Product design: user-approved OpenDipper concept; AI-assisted geometric production and web integration, 2026-10-25.
- Chinese outlines: Noto Sans CJK SC Bold (SIL Open Font License 1.1), [upstream](https://github.com/notofonts/noto-cjk).
- Latin outlines: DejaVu Sans Bold ([font license](https://dejavu-fonts.github.io/License.html)). No font software is bundled.
- The fixed brand artwork is an identity asset. This package does **not** grant a new trademark endorsement or blanket license, nor does it change the repository's still-undecided application license. See [rights](https://github.com/X-lab2017/open-dipper/blob/main/docs/RIGHTS.md).
- `scripts/build-brand.py` documents reproducible geometry and outline generation. It is optional development tooling (Python fontTools and the named installed fonts); normal web build uses the committed SVG/PNG files and Python's standard-library ZIP writer only.
