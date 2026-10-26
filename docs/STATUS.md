# 当前状态 / Current status

基线日期：**2026-10-26**。本页描述该次整理时的状态；实际数据新鲜度看部署快照，任务最新状态看关联 issue。

## 当前评审实现：应用 1.3.0

2026-10-26，经维护者批准实现任务式 AI 雷达：两个视角、12 个软件、12 个模型版本、6 个数据集，支持筛选、证据、多标签详情、同类对比、试用导出和本机关注；圈层与建议是独立、可关闭的固定演示。产品品牌资产更新为 **1.1.0**，增加字标留白并更新 SVG/PNG/ICO，X-lab 原始资产保持不变。见 [雷达契约](AI_RADAR.md) 和 [执行计划](plans/ai-radar-implementation.md)。本次 [PR #27](https://github.com/X-lab2017/open-dipper/pull/27) 已合入，[CI / Pages 40268988631](https://github.com/X-lab2017/open-dipper/actions/runs/40268988631) 通过完整测试、浏览器验收与部署；线上已打开核对。评审继续在 [#26](https://github.com/X-lab2017/open-dipper/issues/26)。

## 已接受的地图整合基线

应用 **1.2.0**、视觉 **1.3.0** 已通过 [PR #25](https://github.com/X-lab2017/open-dipper/pull/25) 合入并正式上线；[CI 与 Pages 40261622875](https://github.com/X-lab2017/open-dipper/actions/runs/40261622875) 已通过全部确定性与浏览器验收、自动采集和部署。主入口为 `src/atlas.ts`：六类十八层、可取消的单选组、面积气泡与实体圆点叠加、当前观察多标签、前十排行、紧凑概览与生态脉动。默认地图 10° E / 36° N，深浅主题与地球联动；新闻保留采集快照，模拟增长不进入实测统计。旧分析与全景路线、采集和审核流水线保持兼容。

本节优先于下方历史版本的布局与样本规模说明。当前契约见 [ATLAS_WORKSPACE.md](ATLAS_WORKSPACE.md)，合入和部署检查见 [发布计划](plans/atlas-release-v9.md)。下方验证回执均为各自历史版本，不能作为此次版本验收。

本版本已按维护者确认记录为[可复用基线](../design/baselines/atlas-1.3.0.md)，包含固定提交、源文件指纹和[模块模板](templates/OBSERVATORY_MODULE.md)。[AI 雷达设计提案](design/AI_RADAR_PROPOSAL.md) 已获批准并形成上述评审实现；付费服务、通知投递与独立采用评审尚未开通。

## 已落地

- 开源北斗 OpenDipper 产品身份 1.0：独立七星网络/开放轨道/方向星，双语与英文顶栏、深浅主题和 favicon；中英仓库入口、SVG/透明 PNG/ICO 与可下载品牌包已纳入源码。X-lab 官方文件保持原样。生产字标为参考批准稿的新排字轮廓，见[资产与来源](../public/brand/opendipper/README.md)。本次本地 typecheck、68 项确定性检查及构建通过；浏览器和 Pages 状态应以此提交的 Actions 回执为准，不能沿用下列旧数据版结果。

- 精简真实数据层：OpenShare 全球开发者总量及三种地域分布，GOSD / OpenGauge 的 HF 模型仓库／数据集总量与一张月度新增图；观察时间分开披露。来源、覆盖、手工更新边界见[数据证据契约](DATA_EVIDENCE.md)，本轮验收记录见 [#20](https://github.com/X-lab2017/open-dipper/issues/20)。

- 情报门户框架 **1.1.0**：全球观测、AI 雷达、开源生态、情报订阅、参与共建与本机关注；真实 AI 项目发布通过显式映射进入雷达，8 个固定虚构案例展示分析与证据结构。
- 首页地图区域扩大，月度排行与趋势移至开源生态；两屏第二屏展示 AI 精选与样刊。主题关注、收藏、频率偏好和 Markdown 导出在本机工作。
- 公开样刊与 Open/Pro 方案可评审，尚未收费、推送、云端同步或开展真实 Agent 自动研究；未虚构专家／机构背书。范围见[情报框架契约](INTELLIGENCE.md)，本轮验证与部署证据见 [#14](https://github.com/X-lab2017/open-dipper/issues/14)。

- 产品架构 v1：地图 / 地球 / 快讯，独立月度分析、证据查看、自动采集与人工审核事件；静态发布与最后成功快照保留。
- 视觉基线 **1.2.0**：X-lab 官方标志、共享 CSS/Canvas tokens、默认地图、海陆层次和海岸微光、点阵/轮廓、惯性平移和缩放定位；地球保留光照、大气辉光与惯性操作。
- 桌面默认一屏总览，可切换两屏演示和全屏；≤1000px 自然滚动。紧凑顶栏和面板减少占用，官方标志与产品字标协调。
- 中文/英文、深色/浅色、键盘与减少动态效果；保留分析页和历史全景兼容路由。
- AI 协作入口、公开协作说明、任务上下文索引、文档一致性检查、issue/PR/交接模板已纳入知识库。
- README 与贡献指南采用英文默认、中文独立入口；业务/技术 Mermaid 图帮助理解产品。按 [Harness 工作流](HARNESS.md) 区分人类需求入口与 Agent 工程执行，加入执行计划、验收映射和双语一致性检查。Agent 目前由协作者启动，未配置自动 issue 调度。

历史整理时应用版本为 **1.1.0**、视觉版本为 **1.2.0**；当前版本见上方。它们是不同的版本轴，本文没有声明已创建对应 Git tag 或 GitHub Release。

## 验证证据

数据内容接入：[3d75239](https://github.com/X-lab2017/open-dipper/commit/3d75239f569e2e43ecb2843a6ee1118be986c08d)。[CI 与 Pages](https://github.com/X-lab2017/open-dipper/actions/runs/40167099362) 已通过 66 项确定性检查、构建和四套 Chromium 验收；线上已核对四项概览、OpenShare 图层切换、AI 供给数值与固定版本来源链接。发布截图及本轮后续归档检查见 [#20](https://github.com/X-lab2017/open-dipper/issues/20)。

情报门户实现：[4a989df](https://github.com/X-lab2017/open-dipper/commit/4a989dfa91924abb857ea0b6c9ea97ec130a3d06)。[CI 与 Pages](https://github.com/X-lab2017/open-dipper/actions/runs/40163939827) 已通过 60 项确定性测试、构建和四套 Chromium 验收（观测站、情报门户、历史全景、分析页）；已在正式站点检查地图默认入口、AI 雷达与情报样刊。后续截图归档及手机方案表细节修订的验证随 [#14](https://github.com/X-lab2017/open-dipper/issues/14) 更新。

地图与大屏基线提交：[3862477](https://github.com/X-lab2017/open-dipper/commit/38624774e7f65907947481082676d67da0aedace)。对应 [Actions 运行](https://github.com/X-lab2017/open-dipper/actions/runs/40152382147) 已通过确定性检查、生产构建、三套 Chromium 验收和 Pages 部署。本轮文档整理的提交与验证见下方知识库 issue；不要把上一轮 CI 当作新改动的验证。

入口：[观测站](https://www.x-lab.info/open-dipper/) · [视觉规范页](https://www.x-lab.info/open-dipper/design-system.html) · [Actions](https://github.com/X-lab2017/open-dipper/actions)

## 仍然存在的边界

| 主题 | 当前能力 | 尚未完成 |
| --- | --- | --- |
| 月度指标 | 20 个精选仓库、4 平台、6 指标 | 全域覆盖、可比较的全球月度地域聚合 |
| 全球快照 | OpenShare 224 / 236 / 30 地域三指标；GOSD 模型／数据集供给 | 地域观察期、未知分母及末月完整性未披露；手工更新 |
| 组织地域 | Microsoft / Apache / PyTorch Foundation 三个标签的独立近一年分布 | 精确起止、未知国家分母；均不能自行补造 |
| 事件 | GitHub releases、OpenSSF/CNCF RSS、审核 issue | 更完整来源、自动实体/地理解析、来源质量评估 |
| 演示 | 13 个固定虚构生态事件、8 个情报场景和模拟地域指标 | 不作为真实统计，日期不随部署刷新 |
| 时效 | 事件目标每 30 分钟采集，前端每 5 分钟检查部署快照 | 无流式推送或硬实时 SLA |
| 协作 | GitHub 审核、本地项目／主题关注、收藏与草稿 | 无共享账户后台、云端草稿或多人实时编辑 |
| 情报服务 | 30 个雷达候选、来源证据、固定建议演示、同类对比、公开样刊与本机导出 | 自动研究、独立评审、支付／权益和通知投递尚未实现 |
| 许可 | 保留第三方/品牌来源与 notice | 应用代码根 LICENSE 和数据复用条款待维护者确认 |

## GitHub 记录与后续任务

建议顺序与验收门槛见[中文路线图](../ROADMAP.zh-CN.md) / [English](../ROADMAP.md)：R1 可靠基础与参与入口 → R2 有证据的数据扩展 → R3 分析与复用。它们是计划，尚未实施；首批任务和最新进度由 #8 及关联 issue 维护。

<!-- issue-index:start -->
| 类型 | 记录 / 任务 |
| --- | --- |
| 已交付架构记录 | [#1 双时钟数据、地图/地球/快讯与审核发布](https://github.com/X-lab2017/open-dipper/issues/1) |
| 已交付视觉记录 | [#2 视觉 1.0 → 1.2、参考纠正与演示布局](https://github.com/X-lab2017/open-dipper/issues/2) |
| 本轮知识库记录与验收 | [#3 AI-friendly 入口、协作披露、索引与清理](https://github.com/X-lab2017/open-dipper/issues/3) |
| 双语与 Harness 协作记录 | [#7 双语首页、业务/技术图与 Agent 工程闭环](https://github.com/X-lab2017/open-dipper/issues/7) |
| 路线与首批参与任务 | [#8 R1–R3 统筹、验收门槛与 #9–#13 工作包](https://github.com/X-lab2017/open-dipper/issues/8) |
| 后续数据接入 | [#4 OpenDigger 全域与月度地域](https://github.com/X-lab2017/open-dipper/issues/4) |
| 后续事件能力 | [#5 来源、审核容量与地理证据](https://github.com/X-lab2017/open-dipper/issues/5) |
| 维护者待决策 | [#6 应用许可与各类资源复用边界](https://github.com/X-lab2017/open-dipper/issues/6) |
| 情报门户框架与后续工作 | [#14 交付](https://github.com/X-lab2017/open-dipper/issues/14)；#15 来源、#16 证据、#17 服务、#18 编辑、#19 首份材料见[框架契约](INTELLIGENCE.md) |
| 数据内容接入 | [#20 OpenShare 全球分布与 GOSD AI 供给](https://github.com/X-lab2017/open-dipper/issues/20) |
| AI 雷达设计评审 | [#26 两个视角、任务式选型、证据圈层与可持续服务](https://github.com/X-lab2017/open-dipper/issues/26)；当前实现与发布回执 |
<!-- issue-index:end -->

接手时先看 issue 的最新状态、关联提交和验收条件。更多背景见 [演进记录](HISTORY.md)、[决策记录](DECISIONS.md) 和 [开发指南](DEVELOPMENT.md)。

## 观测工作台更新（2026-10-25）

六种受众视角、实体图层与八类数据总览已纳入实现；新增组织／仓库标签索引、模型／数据集发布组织地域样本、集中来源入口和实际快照检查反馈。机构位置、数据中心仍待接入。台湾显示与中国范围筛选由共用函数维护。契约见 [OBSERVATION_WORKSPACE.md](OBSERVATION_WORKSPACE.md)，本次 CI、浏览器和部署回执以 [#24](https://github.com/X-lab2017/open-dipper/issues/24) 与 [PR #23](https://github.com/X-lab2017/open-dipper/pull/23) 为准。
