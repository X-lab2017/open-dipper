# OpenDipper × X-lab AI 视觉体系 v1.0

在线规范：https://www.x-lab.info/open-dipper/design-system.html

本基线将 X-lab AI 的品牌身份和 OpenDipper 的密集数据工作台结合起来。品牌、主题、数据语义与组件各自有清晰职责；后续页面优先复用变量和组件，而不是复制首页样式。

## 1. 品牌归属与官方素材

- 实验室母品牌：X-lab AI；产品名称：OpenDipper；说明：GLOBAL OPEN SOURCE OBSERVATORY / 全球开源生态观测站。
- 官方标志来自 `X-lab2017/xlab-ai-brand`，锁定版本 `373d61f0d6e334f0b85af0dd5d8ef9b9095bcc37`。六个 SVG 原样保存于 `public/brand/`，来源路径和 Git blob SHA 记录在 `provenance.json`，测试验证字节一致。
- 桌面导航使用 Compact Wordmark，展示宽度 160px；空间不足时改用专用 X Favicon（32–40px），不压缩完整横版标志。横版建议宽度至少 320px。
- ColorDark 用于深底，ColorLight 用于浅底。使用 `xlabLogo()` 自动提供对应版本；保留原始 X 负形、AI 右上标与内置安全区。禁止重绘、变形、加描边、换色、阴影或裁切。
- 产品名称与品牌之间使用细分隔线；北斗七星为产品辅助图形，不替代母品牌。
- 原始素材未授予通用开源许可。上游 `NOTICE.md` 原文随资源分发，下载本包不产生新的品牌、商标或再授权权利。实验室以本项目展示品牌的使用请求来自本次项目授权。

## 2. 颜色的层级

| 层级 | 原色或变量 | 用途 |
| --- | --- | --- |
| 品牌绿 | `#9AD744` | 品牌身份、主操作、深色主题强调 |
| 品牌蓝 | `#07A1D7` | 品牌身份、活跃度图形 |
| 品牌载体 | `#171A1F` | 深色面板与 Logo 载体 |
| 文字 | `text` / `text-secondary` / `text-muted` | 主要内容 / 次要内容 / 来源元信息 |
| 表面 | `surface-page` / `surface-panel` / `surface-raised` | 页面 / 面板 / 悬停与选中背景 |
| 语义 | `accent` / `info` / `warning` / `critical` / `manual` | 强调 / 信息 / 待更新 / 错误或紧急 / 人工核验 |

**品牌色不可修改，界面语义色可按主题派生。** 浅色主题强调文字采用 `#466F17`，信息文字 `#086B91`。不能把 `#9AD744` 直接用于白底小字。按钮以原始绿作背景，搭配 `#171A1F` 文字。正文与元信息对面板目标对比度 ≥ 4.5:1；基线测试覆盖核心正文、事件文字、状态标签。这个检查不等同于整站 WCAG 认证。

面板弱边框用于组织信息；控件边界、焦点和文字不依赖弱分隔线来表达状态。使用颜色时总是加上文字、图标或形态，不能只凭红绿判读。

## 3. 数据语义

| 维度 | 表达 | 规则 |
| --- | --- | --- |
| 活跃度 / 参与者 | 蓝色 `chart-activity`，地图色相 196 | 活跃度原始口径；参与者保持人数单位 |
| 贡献量 / 贡献者 | 青色 `chart-contribution`，地图色相 170 | 合并 PR 是贡献量代理，不能写成综合贡献度 |
| 影响力 | 绿色 `chart-influence`，地图色相 84 | OpenRank 保持独立含义；新增 Star 单列自身指标 |
| 地图地域 | 单指标顺序色阶 + 节点尺度 | 色阶与指标同步，按当前样本对数归一化；不用于跨图直接比较 |
| 事件类别 | 六类颜色 + 六类线性图标 + 分类名称 | 发布、安全、治理、政策、社区、研究 |
| 数据来源 | 自动蓝 / 人工紫 / 模拟琥珀虚线标签 | 与事件类别独立；模拟节点再加虚线环 |
| 缺失 / 未定位 | `—` / 缺口 / “全球或未定位” | 不把缺失填成零，不推断项目总部，不虚构连线 |

地图以深蓝低饱和表面承载地理信息，让节点保持可见。图形颜色通过 `src/design/palette.ts` 获取，DOM 通过同一源生成的 CSS 变量获取，避免 Canvas 与主题脱节。事件图形使用主题类别色，主趋势条形使用所选指标颜色。

所有数据卡标明统计对象、窗口或月份、来源和范围。真实地域贡献者为近一年聚合，月度轴只改变月度仓库数据和明确标为模拟的地域演示。

## 4. 信息架构与 WorldMonitor 的借鉴

参考仓库：`https://github.com/koala73/worldmonitor`，参考版本 `d8ba38d8246fac3035b3eacc68d1e4dd9193a69f`。

| 查阅依据 | 借鉴的产品做法 | 本项目落地 |
| --- | --- | --- |
| `README.zh-CN.md` 的地图与模块说明 | 地图是共同空间上下文，不同视图共享信息 | 地图 / 地球 / 事件流共用筛选条件、数据与类别语义 |
| `src/styles/main.css` | 语义颜色与明暗主题集中定义 | 单一 `design/tokens.json` 生成 CSS 和 Canvas 配色 |
| `src/components/Panel.ts` | 统一面板标题、内容、数量和时效状态 | 共享 Panel / PanelHead / Badge 原语，来源时间紧邻事件流 |
| `src/utils/theme-manager.ts` | 主题持久化、启动时应用、主题影响地图 | 启动前恢复偏好；切换 Logo、favicon、meta 主题色、地图和趋势色 |
| 面板内高密度信息组织 | 先概览，再空间，再细节 | 概览条 + 左侧图层 + 地图/月轴/排行 + 右侧快讯；舒适/紧凑密度本机保存 |

这些是独立实现的交互与设计模式。**未复制、移植或依赖 WorldMonitor 源码、样式文件、图标或品牌资源**。该仓库的 AGPL 条件没有被用来给 X-lab 品牌素材重新授权。本轮没有实现面板拖动、缩放或任意布局保存；这些属于后续产品能力，不是当前基线的承诺。

## 5. 组件契约

共享组件定义在 `src/design/components.css`，可脱离 Vite 用 `tokens.css` + `components.css` 接入。

| 组件 | 类名 / 入口 | 约束 |
| --- | --- | --- |
| 面板 | `.od-panel` / `.od-panel-head` / `.od-panel-body` | 标题 + 可选数量/状态；圆角 6px；不裁切关键来源说明 |
| 操作 | `.od-button` / `.primary` | 名称、焦点、禁用与 pressed 状态；主操作每区块优先一个 |
| 输入 | `.od-input` | 必须配 label；不依靠 placeholder 替代名称 |
| 来源状态 | `.od-badge` + `.manual` / `.demo` | 明确来源；模拟使用虚线；紧急不覆盖来源标签 |
| 空状态 | `.od-empty` | 说明原因；业务页面提供重置或重试入口 |
| 数值 | `.od-stat` / `.od-mono` | 等宽数字；单位、时间与范围分离显示 |
| 图标 | `icon(name)` | 原创 16px 线性 SVG，1.6px 描边，随 currentColor 主题变化 |
| 标志 | `xlabLogo()` / `applyAppearance()` | 使用官方资源；页面切换主题时同步 favicon 和背景 |

首页保留既有业务选择器，通过共享原语适配，便于功能测试持续稳定。业务布局在 `src/observatory/style.css`，不要把特定面板的网格尺寸放进通用组件。

## 6. 排版、空间与响应式

- 字体：Inter（本机存在时）/ Segoe UI / 苹方 / 微软雅黑 / system-ui；不请求外部字体。数字：SFMono / Consolas / Liberation Mono。
- 常用字号：正文 13px、控制/标题 12–16px、来源 11px、页面标题 24px、展示数字 36px。极密图例、时间戳或表格辅助标签可用 9–10px，并必须保留可放大、可查看的完整信息。
- 空间：4、8、12、16、20、24、32、48px。控件/面板/弹窗圆角：4/6/10px。
- 动效：120–300ms，遵从 `prefers-reduced-motion`；数据来源状态不用持续闪烁来暗示实时成功。
- 桌面：图层 / 地图 / 事件三列；中屏：事件流转为下方；手机：地图、项目、图层、事件顺序堆叠。地图、弹窗和规范页都不能造成页面横向溢出。
- 舒适/紧凑偏好存在本机 `od:density`，主题在 `od:light`；不保存到服务器。规范页与观测站复用同一偏好。

## 7. 维护与发布

```sh
# 修改 design/tokens.json 或共享组件后
npm run design:build
npm run design:check
npm test
npm run build
```

- 单一变量源：`design/tokens.json`；不要直接修改自动生成的 CSS / TS。
- 样式页：`design-system.html`、`src/design/showcase.ts`，展示真实共享原语；示例数据始终明确标为合成。
- `npm run build` 验证变量同步、构建下载包，再生成网站。资源包输出 `public/design-system/open-dipper-visual-baseline-v1.zip` 并复制到站点，二进制构建产物不提交。
- 自动检查：官方 SVG blob SHA、生成产物一致性、核心文本和状态对比度、所有事件/指标主题色存在；浏览器验收 Logo 主题切换、密度持久化、规范页交互、资源下载、390px 手机无溢出，以及既有地图/事件/手工草稿功能。
- 增加组件时同步更新示例、语义变量及规范。本基线采用语义版本；变量删除/语义重分配属于破坏性变更，升级主版本；新增变量/组件升级次版本。
- v1 适用范围是新版观测站与视觉规范页。历史 `analysis.html`、`panorama.html` 保持兼容，后续可按此基线迁移。
