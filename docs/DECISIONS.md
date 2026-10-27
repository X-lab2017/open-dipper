# 决策记录 / Architecture and product decisions

以下决策在 2026-10-25 基线中生效。后续改变应在关联 issue 中说明新证据，并在这里标注被哪个决策替代；不要抹去原来的理由。

## ADR-001 · 分开记录两个参考项目

**背景**：早期“World Monitor”称呼混用了产品体验与开源仓库，导致视觉融合方向不够明确。

**决定**：地图 / 地球 / 快讯保持现有结构；空间体验参考 [world-monitor.com](https://world-monitor.com/)，工程布局和状态表达参考 [koala73/worldmonitor](https://github.com/koala73/worldmonitor)。后者官方身份页明确其站点是 worldmonitor.app，并将 world-monitor.com 列为独立产品（[一手身份说明](https://github.com/koala73/worldmonitor/blob/main/public/world-monitor.md)，核验于 2026-10-25）。OpenDipper 独立实现，没有引入这两个项目的应用源码。

**影响**：引用时写完整域名或仓库，不再用模糊归属；不能把一个项目的源码许可套用到另一个站点。参考检查时地球受 WebGL 环境限制，未声称逐像素复刻。详细参考版本见 [视觉规范](VISUAL_SYSTEM.md)。

## ADR-002 · 月度指标、年度地域、事件分开计时

**决定**：月度仓库指标按各指标实际月份；真实标签地域保留独立近一年语义；事件按源发布时间和采集时间。模拟数据独立保存、固定日期、明确标识。

**理由与代价**：避免把导出时间当观测水位，或将年度分布伪装为月度变化。界面需要展示多个时间与范围；未来真正的月度地域数据应接入新契约，而非改名现有标签数据。

## ADR-003 · 静态快照优先，审核作为人工事件发布门槛

**决定**：Actions 采集有界数据、验证并归档，再部署静态站点；失败保留最后成功数据并披露过期。人工编辑先生成本地草稿，再进入 GitHub issue；维护者审核标签生效，后续编辑或评论需要重新审核。

**理由与代价**：减少运行服务与凭据暴露，留下可追溯记录。无法提供硬实时或多人编辑；事件增加到当前容量之外时再迁移队列/存储。不能为方便 Agent 操作绕过审核。

## ADR-004 · 共享视觉 tokens，官方标志与数据色分工

**决定**：`design/tokens.json` 生成 CSS 与 Canvas 调色板；官方 SVG 保持原样，附固定上游版本与 notice。低饱和界面承载数据，品牌绿只承担有限品牌角色。

**理由与代价**：主题和图形可同步复用，避免前一次融合不匹配。所有 token 改动必须重新生成并通过一致性与核心对比度检查；后者不是完整无障碍认证。

## ADR-005 · 独立 Canvas 地球与默认平面地图

**决定**：Canvas 2D + d3-geo，地球正射投影、地图 Mercator；几何来自已有 Natural Earth。用光照/辉光/地理点阵改善空间层次，保持可定位的数据节点优先。默认地图，保留惯性、缩放、地域定位、键盘和 reduced-motion。

**理由与代价**：无需 WebGL，能复用现有几何与主题。当前不是三维地形引擎；点阵是表面纹理，不是观测值，Mercator 面积也不是贡献量。

## ADR-006 · 一屏工作、两屏演示、移动端自然流

**决定**：桌面默认一屏总览，内部列表可滚动；两屏第一屏保留空间和快讯，第二屏展开分析；全屏是独立控制。≤1000px 不强行压成一屏，官方 logo 缩小以协调标题。

**理由与代价**：兼顾地图可用面积与分析完整性，避免靠减少数据行伪装紧凑。需要覆盖不同宽高和中英文的浏览器验收。

## ADR-007 · 仓库作为人和 Agent 的公共上下文

**决定**：AGENTS 提供短入口，任务索引指向权威文档，历史与当前状态分开；自动检查本地链接和生成镜像。README/贡献指南披露 AI 辅助范围，PR 和交接记录实际验证。

**理由与代价**：参与者不依赖私有聊天历史，避免维护多份矛盾指令。`llms.txt` 是发现入口，不承诺所有 Agent 自动识别，也不授予操作权限；维护者仍需更新行为相关文档。

## ADR-008 · 英文默认入口，人提出需求、Agent 主导工程

**背景**：混合语言首页和面向工程人员的需求表单增加了普通参与者的负担。维护者要求按 Harness 工程组织信息，公开表达 Agent 为主要工程协作者，并增加业务与技术两种结构视图。

**决定**：README 默认英文，中文独立且互链；贡献指南采用同样结构。首页呈现人/维护者/Agent 分工、需求入口、工程闭环、已具备的支撑和实际自动化边界，并以原生 Mermaid 展示业务和当前技术架构。技术拆解由维护者和 Agent 完成，普通需求只要求场景与期望结果。复杂任务保存版本化计划，交付提供逐项验收证据。

**参考与影响**：[Harness engineering](https://openai.com/index/harness-engineering/) 提供参考原则，具体工作流与实现状态在 [HARNESS.md](HARNESS.md)。新增双语结构/链接/命令/图结构检查，不宣称自动判断翻译质量，也不宣称已有常驻 issue 调度器、自主合并或完整架构 lint。既有任务授权继续适用；人类代码贡献仍然欢迎。

## ADR-009 · 公共观测、个人关注与专业情报框架

**决定**：保留地图／地球／快讯为共同空间视图，新增 AI 雷达、开源生态、情报订阅和共建导航。月度分析进入开源生态，两屏第二屏承载 AI 与样刊；这替代 ADR-006 中第二屏仅展开月度分析的安排。公共信息、明确主题映射与固定模拟条目共用情报详情，保留不同来源和时钟。

**服务边界**：本机关注、偏好与导出可用，公开样刊用于评审；尚未建立付费服务、云端账户或 Agent 研究流水线。不把示例证据、评测、研究者或机构背书写为事实。未来付费全文与权益必须在服务端，不能藏在公开静态包中。见[情报契约](INTELLIGENCE.md)与 [#14](https://github.com/X-lab2017/open-dipper/issues/14)。

## 2026-10-25 — Focused observed evidence, independent source clocks

Issue [#20](https://github.com/X-lab2017/open-dipper/issues/20) adds four sourced facts, three global map measures and one switchable AI supply chart. Preserve the existing scene and OpenDigger project lens. Retain pinned extracts and an offline adapter, not report UI code. Country periods remain unknown; platform totals and monthly additions retain separate timestamps. Optional snapshot failure cannot enable simulated values. See [DATA_EVIDENCE.md](DATA_EVIDENCE.md); this is not completion of monthly geography #9.

## 2026-10-26 — Promote the multilayer review workspace

Use `src/atlas.ts` as the production entry while preserving analysis/panorama routes and collection contracts. Separate area fills, proportional regional bubbles and circular located entities; optional exclusive developer/asset groups coexist with additive point layers. Global totals stay fixed; inspection tabs separate unlike measures. One token registry drives both themes, Canvas and legends. Default north-up map center 10° E / 36° N balances the US and China without a geographic rotation or a Pacific-only view. See [contract](ATLAS_WORKSPACE.md) and [release validation](plans/atlas-release-v9.md).


## 2026-10-26 — Task-oriented radar and reusable discovery interactions

The accepted radar uses two lenses for software and models/data, equal numbered circular targets, stable placement and one focused inspector. Review feedback expanded the source catalog from 30 to 160 identities; each lens shows 80 targets and supports sector focus. Catalog indices and precise positions do not encode rank or measured quality. Actual source facts are independent of fixed simulated adoption judgments, which can be turned off.

Shared sidebars, segmented controls, theme tokens and bilingual identity align radar with the atlas. Expanded selection must preserve context; explicit return, Escape and restored focus are part of the interaction contract. Keep one usage guide and one catalog source entry while retaining candidate-level evidence. This replaces the original proposal's smaller target budget and unequal sidebar recommendation. See [AI_RADAR.md](AI_RADAR.md) and [accepted baseline](../design/baselines/observatory-radar-1.3.2.md).

## 2026-10-26 — Current knowledge before historical context

The repository separates current status/contracts, immutable accepted baselines and archived proposals. Normal Agent task paths point to production modules, not unconsumed design types. Preserve decision/source provenance and selected screenshots; remove superseded mockups with pinned Git recovery links. Feedback intake distinguishes needs, defects, evidence corrections, experience review and editorial events; only the last uses independent event approval. No new license, autonomous dispatch or community response SLA is implied. See [maintenance](MAINTENANCE.md) and [community work #30](https://github.com/X-lab2017/open-dipper/issues/30).

## 2026-10-26 — Separate networks, one explorable universe (review)

The ecosystem review replaces the card landing page with independently rendered OpenGalaxy and ModelGalaxy snapshots. Preserve their original coordinates and provenance, normalize them into separate fields, and do not invent cross-network bridges. Contributor affinity and model metadata relationships have distinct meanings; inferred model edges default off. A large canvas, accessible search list, focused profile and explicit camera tour support exploration without claiming real-time network evolution. This supersedes the ecosystem landing portion of ADR-009 for the review version only. The accepted map/radar baseline remains unchanged. See [contract](OPEN_GALAXY.md) and [execution evidence](plans/ecosystem-galaxy.md).

## 2026-10-27 — Observatory composition and finite World tour

Keep the compact structure accepted in PR #37. The default now opens Active developers and orders companies, benchmark projects, model assets and conferences after it. A balanced Mercator inhabited-land frame supersedes the multilayer workspace’s former 10° E / 36° N home camera. Shared SVG geometry slots preserve area/bubble/point semantics. World tour is opt-in and finite, alternates global map comparisons with sourced globe anchors, retains global inspector scope and restores the prior workspace on exit. Reduced motion/manual input/hidden pages pause it; navigation disposes timers. The navigation label is Open Galaxy / 开源星系 with the existing route retained. See [contract](ATLAS_WORKSPACE.md) and [validation plan](plans/observatory-tour.md).

## 2026-10-27 — Browse-first, typed evidence library

Promote Agent Room to the public Pages client, retaining research/following as explicit local prototypes. Eight forms and six topic facets organize a bounded source index. Use canonical object URLs and provenance-bearing `describes`/`references` links, not guessed semantic edges. Preserve publication/capture/observation clocks and last-good collection with visible failures. This supersedes the private-only delivery gate of the Agent Room prototype. See [library contract](INTELLIGENCE_LIBRARY.md).
