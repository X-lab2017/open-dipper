# 当前状态 / Current status

基线日期：**2026-10-26**。维护者已接受应用 **1.3.2** 的地图与 AI 雷达体验；视觉 tokens **1.3.0**，产品品牌 **1.1.0**。这三个版本轴独立，不代表新建 Git tag 或 GitHub Release。实时任务状态看 issue，数据新鲜度看来源快照。

## 当前能做什么

| 模块 | 已实现 | 权威入口 |
| --- | --- | --- |
| 全球观测 | 默认地图、地球、快讯；六类十八层，面/气泡/圆点叠加；当前观察标签、排行榜、紧凑概览与脉动 | [Atlas 契约](ATLAS_WORKSPACE.md) |
| AI 雷达 | 80 软件 + 60 模型 + 20 数据集；双视角各 80 个编号目标；任务筛选、分区聚焦、来源证据、同类对比、试用导出、本机关注 | [雷达契约](AI_RADAR.md) |
| 统一展示 | 双语品牌、明暗模式、一/两屏；地图全屏、雷达展开及返回；移动端自然流、键盘和减少动态效果 | [复用基线](../design/baselines/observatory-radar-1.3.2.md) |
| 生态与情报框架 | 月度样本排行、公开样刊、关注和本机导出、事件提交流程 | [情报契约](INTELLIGENCE.md) |
| 数据与发布 | 固定版本来源摘录、OpenDigger 月度样本、官方事件采集与独立人工审核，静态快照与 Pages | [数据契约](DATA_CONTRACTS.md) · [运维](OPERATIONS.md) |
| 仓库协作 | 双语入口、需求/缺陷/纠错/体验/事件表单、Agent 上下文、PR 验收与交接 | [贡献指南](../CONTRIBUTING.zh-CN.md) · [Harness](HARNESS.md) |

## 已验证的产品版本

[PR #29](https://github.com/X-lab2017/open-dipper/pull/29) 合入提交 `6544f48ccaab9a43a7c56069c487f620ec83723e`；[PR CI](https://github.com/X-lab2017/open-dipper/actions/runs/40275718242) 与[生产 CI / Pages](https://github.com/X-lab2017/open-dipper/actions/runs/40275957548) 的构建和浏览器验收通过，部署成功。2026-10-26 正式站点核对 80 个目标、单一指南/来源入口、展开选择和返回。详细回执见 [收尾计划](plans/ai-radar-finish-v3.md) 与 [#26](https://github.com/X-lab2017/open-dipper/issues/26)。

本轮仓库与社区整理不改产品行为；独立验收和交付在 [#30](https://github.com/X-lab2017/open-dipper/issues/30)。不能把上面的产品 CI 当成本轮文档变更的验证。过去版本、截图与取舍统一从 [HISTORY.md](HISTORY.md) 查阅。

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
