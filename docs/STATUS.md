# 当前状态 / Current status

核对日期：**2026-10-27**。当前应用 **1.6.0**；维护者已接受的地图／AI 雷达固定基线仍为 **1.3.2**，当前视觉 tokens **1.4.0**（固定历史基线为 **1.3.0**），产品品牌 **1.1.0**。版本轴独立，不代表新建 Git tag 或 GitHub Release。实时任务状态看 issue/PR，数据新鲜度看来源快照。

**1.5.1 开源星系已公开发布**：在 1.5.0 研究评审基础上增强深浅主题动态效果，保留双星系、任务发现、候选对照、记录关系路径与可导出研究报告。1.3.2 地图/雷达的已接受基线及指纹保持不变；本轮发布与实际验收见 [发布记录](plans/ecosystem-public-release.md)。

## 紧凑观测视觉 1.5.2

维护者已确认三栏结构与信息密度，并授权进一步优化明暗体系后发布 Pages。[PR #37](https://github.com/X-lab2017/open-dipper/pull/37) 承接本次实现与最终 CI／部署回执；[执行记录](plans/visual-workbench-review.md) 保留验收条件。深色采用墨蓝表面与青蓝高光，浅色采用冷白表面与墨色线条；两者共享文字、状态和图层语义，产品 Logo 缩至桌面 148px。全球观测、雷达和星系沿用原有结构、信息与交互；历史固定基线指纹不改写。

## 观测取景与环球巡航 1.6.0

地图按主要陆地区域重新居中，左栏面/泡/点共享统一 SVG 尺寸和对齐。默认打开活跃开发者，标签顺序为开发者、企业、标杆项目、模型资产、会议与活动。新增五站“环球巡航”，支持暂停、切站、退出恢复、减少动态效果与手机面板跳转；导航统一为“开源星系”。既有结构、数据和生态脉动保留。维护者已授权验证后发布；应用代码已通过 [完整浏览器验收](https://github.com/X-lab2017/open-dipper/actions/runs/40429292901)。实现、合并与 Pages 最终回执见 [PR #38](https://github.com/X-lab2017/open-dipper/pull/38)，[执行记录](plans/observatory-tour.md) 保留验收细节。

## 当前能做什么

| 模块 | 已实现 | 权威入口 |
| --- | --- | --- |
| 全球观测 | 默认地图、地球、快讯；六类十八层，面/气泡/圆点叠加；当前观察标签、排行榜、紧凑概览与脉动 | [Atlas 契约](ATLAS_WORKSPACE.md) |
| AI 雷达 | 80 软件 + 60 模型 + 20 数据集；双视角各 80 个编号目标；任务筛选、分区聚焦、来源证据、同类对比、试用导出、本机关注 | [雷达契约](AI_RADAR.md) |
| 统一展示 | 双语品牌、明暗模式、一/两屏；地图全屏、雷达展开及返回；移动端自然流、键盘和减少动态效果 | [复用基线](../design/baselines/observatory-radar-1.3.2.md) |
| 开源星系 | 19,771 个代码仓库 + 24,000 个模型/数据集/应用节点；记录与推断分离；任务搜索、3 项清单、3 跳内路径、月度证据与报告导出 | [星系契约](OPEN_GALAXY.md) |
| 情报框架 | 公开样刊、关注和本机导出、事件提交流程 | [情报契约](INTELLIGENCE.md) |
| 数据与发布 | 固定版本来源摘录、OpenDigger 月度样本、官方事件采集与独立人工审核，静态快照与 Pages | [数据契约](DATA_CONTRACTS.md) · [运维](OPERATIONS.md) |
| 仓库协作 | 双语入口、需求/缺陷/纠错/体验/事件表单、Agent 上下文、PR 验收与交接 | [贡献指南](../CONTRIBUTING.zh-CN.md) · [Harness](HARNESS.md) |

## 已验证的交付

| 交付 | 实现与验收 |
| --- | --- |
| 地图与 AI 雷达 1.3.2 | [PR #29](https://github.com/X-lab2017/open-dipper/pull/29)；[CI / Pages 40275957548](https://github.com/X-lab2017/open-dipper/actions/runs/40275957548) 成功；固定指纹与验收见 [基线](../design/baselines/observatory-radar-1.3.2.md) |
| 仓库与社区整理 | [PR #31](https://github.com/X-lab2017/open-dipper/pull/31)；[CI / Pages 40278908179](https://github.com/X-lab2017/open-dipper/actions/runs/40278908179) 成功；整理回执见 [#30](https://github.com/X-lab2017/open-dipper/issues/30) |
| 开源星系 1.5.1 | [PR #33](https://github.com/X-lab2017/open-dipper/pull/33) 已合并至 `8c12aa77312f0e9ed488c81eda4ca5806a7b993e`；[CI / Pages 40328984137](https://github.com/X-lab2017/open-dipper/actions/runs/40328984137) 构建、浏览器验收和部署成功，2026-10-26 北京时间 21:29:37 完成部署；[完整发布记录](plans/ecosystem-public-release.md) |

本轮发布已结束。搜索、关系路径、报告三格式实收、明暗主题、移动布局、减少动态效果和跨模块往返有 CI 证据；物理触屏设备与 PDF 打印尚未验证。发布记录不等同新视觉基线已被维护者接受。

后续开发从模块契约和实时 issue/PR 开始；[已完成计划](plans/README.md)用于追溯，不是待恢复的任务。定期数据采集属于[运维](OPERATIONS.md)，与发布计划是否完成分开。旧版本与评审过程由 [HISTORY.md](HISTORY.md) 承接。

## 仍需共同完成

| 边界 | 当前事实 | 后续入口 |
| --- | --- | --- |
| 全域数据与可比性 | 月度指标仍为 20 个精选仓库；独立全球总量、地域榜、组织/发布者样本不能混加 | [#9 月度地域契约](https://github.com/X-lab2017/open-dipper/issues/9) · [#4 全域覆盖](https://github.com/X-lab2017/open-dipper/issues/4) |
| 启动与故障恢复 | 主入口仍将 12 个快照一起加载；失败进入整页重试，尚未完成全部运行时验证与局部降级 | [#10 加载与恢复](https://github.com/X-lab2017/open-dipper/issues/10) |
| 来源覆盖与时效 | 采集目标每 30 分钟、前端每 5 分钟检查部署快照；没有流式推送或硬实时 SLA | [#11 审核完整性](https://github.com/X-lab2017/open-dipper/issues/11) · [#15 来源接入](https://github.com/X-lab2017/open-dipper/issues/15) |
| 雷达采用判断 | 160 个候选是有来源身份；指标覆盖不齐，圈层与建议为可关闭的固定模拟；无独立任务评测 | [#16 证据关联](https://github.com/X-lab2017/open-dipper/issues/16) · [#18 编辑规则](https://github.com/X-lab2017/open-dipper/issues/18) |
| 地理与设施 | 有来源的区域样本与明确模拟实体并存；全局设施清单、政策适配器仍待独立证据 | [#22 模型后续](https://github.com/X-lab2017/open-dipper/issues/22) |
| 账户与商业服务 | 关注、草稿、导出仅在本机；未实现支付、权益、通知投递、云端同步或自动 Agent 研究 | [#17 服务边界](https://github.com/X-lab2017/open-dipper/issues/17) |
| 仓库许可 | 尚未选定根 LICENSE；代码、数据、几何与品牌各有权利边界 | [#6 许可决策](https://github.com/X-lab2017/open-dipper/issues/6) · [RIGHTS](RIGHTS.md) |

## 从哪里参与

第一次参与可从 [#12 来源目录](https://github.com/X-lab2017/open-dipper/issues/12)、[#13 双语术语](https://github.com/X-lab2017/open-dipper/issues/13)、[#19 来源与样刊材料](https://github.com/X-lab2017/open-dipper/issues/19) 开始。先查看负责人、评论和关联 PR，再说明准备贡献的范围。

工程优先级和阶段门槛以[路线图](../ROADMAP.zh-CN.md)及 [#8](https://github.com/X-lab2017/open-dipper/issues/8) 为准。Agent 从 [AGENTS.md](../AGENTS.md) 进入，再按 [任务索引](CONTEXT.json) 只读取相关契约；历史提案与完成计划不属于默认上下文。
