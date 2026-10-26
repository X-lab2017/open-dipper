# 产品演进与协作记录

本记录整理 2026-10-24 至 2026-10-26 的需求与可验证仓库里程碑。日期按 UTC 归并；不是聊天全文，也不把设计讨论等同于已实现功能。应用版本与视觉资源版本分别管理。

| 阶段 | 反馈/目标 | 落地结果 | 提交证据 |
| --- | --- | --- | --- |
| 原型 0.1 → 0.2，10-24 | 用真实 OpenDigger 样本建立可评审产品，再加入全景地理视图 | 月度数据契约、分析页、三组真实地域分布、静态部署与浏览器验收工作流 | [12706a6](https://github.com/X-lab2017/open-dipper/commit/12706a6) |
| 观测站架构 v1，10-25 | 从原型转为全球开源生态观测站；月度指标与半实时事件协同 | 地图 / 地球 / 快讯骨架，独立数据时钟、事件采集与人工审核、来源状态、真实与模拟分离 | [0b42895](https://github.com/X-lab2017/open-dipper/commit/0b42895979262828503eaa390c12d4a5a2875bdd) |
| 视觉基线 1.0，10-25 | 使用 X-lab logo 与品牌体系，并形成可复用资源 | 官方素材溯源、共享 tokens、主题/组件、视觉展示页和资源包 | [079baaa](https://github.com/X-lab2017/open-dipper/commit/079baaa944b945bead5af7fa3291220f661e8ce0) |
| 视觉基线 1.1，10-25 | 品牌融合仍不协调；查明两个 World Monitor 并非同一项目；保留地图/地球/快讯结构 | 品牌表现更克制，空间体验单独参考 world-monitor.com；独立 Canvas 地球光照、辉光、点阵、惯性与定位 | [53ee18b](https://github.com/X-lab2017/open-dipper/commit/53ee18b7f052e28be44414850346eef13c550c37) |
| 稳定性修正，10-25 | 移动端标签与地图连续平移需要修正 | 换行处理与连续经度 | [cfb5883](https://github.com/X-lab2017/open-dipper/commit/cfb588351e4814d94a34284ac0c89c97b4c2de2b) |
| 视觉基线 1.2，10-25 | 本轮地球体验得到正面反馈；要求默认地图、同步升级地图、压缩空白、支持一/两屏并缩小 X-lab 标志 | Mercator 地图层次、惯性平移、鼠标锚点缩放、地域导航；紧凑布局、一/两屏和全屏、缩小官方标志 | [3862477](https://github.com/X-lab2017/open-dipper/commit/38624774e7f65907947481082676d67da0aedace) |
| 知识库整理，10-25 | 在下一轮功能开发前，公开整理视觉基线、仓库、历史、清理与 Agent 协作方式 | 统一文档入口、Agent 工作指南、契约/运维/交接说明、自动索引与 issue 记录 | [当前状态与 issue](STATUS.md) |

## 后续入口与协作优化 · 2026-10-25

根据维护者反馈，将混合语言首页拆成英文默认版与中文版，并同步贡献指南。首页以人的需求和 Agent 工程职责组织内容，需求表单降低技术门槛；业务与技术架构使用可编辑、双语对应的 Mermaid 图。新增 [Harness 工作流](HARNESS.md)、执行计划和验收映射，明确自动检查与协作约定的区别，保留真实自动化边界。验证与交付见 [当前状态的 issue 索引](STATUS.md)。

## 视觉演进图档 · 2026-10-25

维护者提供了架构评审、X-lab 品牌融合和紧凑地图展示三个阶段的原始截图，已收录至 [视觉演进图档](archive/2026-10-25-visual-evolution.md)。前两张用于追溯过程，第三张同时用于中英文首页展示。图片保留各自当时的选项、样本与模拟标识，不作为实时数据或跨阶段统计比较；当前规范仍以 [视觉基线](VISUAL_SYSTEM.md) 为准。

## 共建路线与任务拆分 · 2026-10-25

在维护者提出继续完善框架、制定 roadmap 和吸引参与者后，新增[双语路线图](../ROADMAP.zh-CN.md)，建议按可靠基础、数据扩展、分析复用三个阶段推进。沿用 #4–#6 大主题，新增 [#8 统筹](https://github.com/X-lab2017/open-dipper/issues/8) 和 #9–#13 首批工作包，其中来源目录、双语术语作为入门任务。范围、依赖和验收已记录，功能实施仍待后续任务推进；不承诺日期、不指定尚未确认的负责人。

## 从协作中保留的结论

1. **先建立完整产品，再逐步接全域数据。** 当前样本与演示是有意的评审阶段；界面完整不表示数据完整。
2. **参考来源必须分清。** world-monitor.com 提供空间交互方向；koala73/worldmonitor 的官方站点是 worldmonitor.app。后者的工程模式是参考材料，不构成前者源码授权。详情见 [决策 ADR-001](DECISIONS.md)。
3. **品牌与数据可视化分工。** 保留 X-lab 官方标识与必要品牌表达，地图和指标使用低饱和、可读的语义色；不是把品牌绿铺满每个组件。
4. **默认工作与演示场景并存。** 默认地图和一屏支持日常观测，两屏保留分析完整度；移动端按自然流阅读。
5. **证据必须进入仓库。** 用户反馈形成可执行验收，Agent 参与实现与验证，交付用提交、CI、契约和 issue 留痕。未验证状态明确标记，不能靠“已完成”的叙述替代检查。

最早的执行记录已原样归档在 [2026-10 原型进度](archive/2026-10-24-prototypes.md)。其中“浏览器无法运行”“尚未部署”等是当时环境结论，已经被后续 CI 与部署证据替代。保留它是为了追溯，不是当前待办。

## 2026-10-25 · AI and open-source intelligence portal

Maintainer direction expanded the public observatory toward researchers and developers: AI radar, personal context, sample intelligence and open contribution. Application 1.1.0 retains the accepted spatial interaction while adding these surfaces, local preferences/export and fixed example evidence. Public methods and sources remain visible; subscription delivery, payments, live Agent research and endorsements are explicitly not implemented. Follow-up tasks #15–#19 separate these gaps from the shipped review framework.

AI-assisted implementation and actual validation are recorded in [delivery #14](https://github.com/X-lab2017/open-dipper/issues/14) and the [versioned plan](plans/intelligence-portal.md). Existing R1 data/reliability tasks remain open.


## 2026-10-25—26 · 从图层试验到地图与雷达基线

| 用户反馈与目标 | 决策和结果 | 交付证据 |
| --- | --- | --- |
| 数据要少而有用，能解释来源与范围 | 接入独立 OpenShare / GOSD 摘录；保留不同观察期和样本边界 | [#20](https://github.com/X-lab2017/open-dipper/issues/20) · [数据证据](DATA_EVIDENCE.md) |
| 图层支持分类、叠加、不同主体与指标 | 早期单对象/十视图提案经工作台实现继续迭代，最终形成六类十八层、区域面/资产气泡/实体圆点、多标签观察和前十排行 | [#22](https://github.com/X-lab2017/open-dipper/issues/22) → [PR #23](https://github.com/X-lab2017/open-dipper/pull/23) → [PR #25](https://github.com/X-lab2017/open-dipper/pull/25) |
| 一屏演示要突出地图，明暗与地球协调 | 概览移至主图上方、脉动压缩、图例可收起；统一主题和全屏返回，接受 Atlas 视觉 1.3.0 | [Atlas 固定基线](../design/baselines/atlas-1.3.0.md) |
| AI 雷达应围绕用户选型任务，同时包含 Agent、模型与数据 | 两个视角、证据详情、同类对比、试用导出和本机关注；首版 30 个有来源候选，建议单独标为模拟 | [PR #27](https://github.com/X-lab2017/open-dipper/pull/27) |
| 首版轮廓、目标和文字太小，内容稀疏；保留中文 Logo | 扩为 160 个身份，双视角各 80 个编号圆点；加大轮廓与目标、分区聚焦和预览；沿用双语资产 | [PR #28](https://github.com/X-lab2017/open-dipper/pull/28) |
| 明暗模式、指导与操作要和全球观测一致 | 共享控件和等宽侧栏、单一指南/来源入口；修复展开选择、分区详情与返回焦点 | [PR #29](https://github.com/X-lab2017/open-dipper/pull/29) · [实际验收](plans/ai-radar-finish-v3.md) |
| 接受 1.3.2 后先整理仓库，让人和 Agent 都能参与 | 固定复用基线，精简双语入口、更新生产路径、提供纠错/体验表单，分开历史并清理失效草稿 | [社区整理 #30](https://github.com/X-lab2017/open-dipper/issues/30) · [基线索引](../design/baselines/README.md) |

以上为需求与可验证产物的概括，不是私人聊天转录。由维护者提供方向和评审，Codex 参与设计、实现、验证和记录；没有声称每条来源都已人工独立核验。

## 给后来参与者的上下文

- 当前真相是模块契约与代码：地图从 `src/atlas.ts` 开始，雷达从 `src/radar/` 开始。旧 `main.ts` 控制器和旧提案不能覆盖新实现。
- 视觉密度由任务决定：雷达用较多、清楚、稳定的目标帮助发现；详情通过聚焦与标签阅读，避免同时堆叠。
- 精简的是重复说明，不是证据：来源、观察期、缺失和模拟判断应始终可查。
- 真实身份不等于真实采用建议；模型、软件、数据也不能混算性能排名。独立评测、自动采集和编辑规则仍由后续任务承担。
- 新模块复用 [1.3.2 基线](../design/baselines/observatory-radar-1.3.2.md)，保留五项全局导航。已完成过程从 [历史档案](archive/README.md) 和 [执行计划](plans/README.md) 按需查阅。
