# 当前状态 / Current status

核对日期：**2026-10-28（北京时间）**。**第一版五模块产品交互与宣传片已完成交付**；应用仍为 **1.15.1**，视觉 tokens **1.4.0**，地图／雷达固定基线 **1.3.2**，品牌 **1.1.0**。第一版收尾是产品里程碑，不新建版本号、tag 或 GitHub Release，也不代表全域数据、真实 Agent 服务或所有 issue 已完成。

[第一版交付与过程记录](releases/first-edition.md) · [在线体验](https://www.x-lab.info/open-dipper/) · [体验反馈 #35](https://github.com/X-lab2017/open-dipper/issues/35) · [开发与验证](DEVELOPMENT.md)

最新已核验发布：[PR #53](https://github.com/X-lab2017/open-dipper/pull/53) 合并；[Pages 40596411391](https://github.com/X-lab2017/open-dipper/actions/runs/40596411391) 成功。五模块导航联动由 [PR #51](https://github.com/X-lab2017/open-dipper/pull/51) 交付。后续提交与任务状态以实时 Actions / issue / PR 为准，数据新鲜度看各快照的观察期与采集时间。

## 当前能做什么

| 模块 | 已实现 | 权威入口 |
| --- | --- | --- |
| 全球观测 | 默认活跃开发者、五站巡航、地图、地球、快讯；六类十八层，面/气泡/圆点叠加；当前观察标签、排行榜、紧凑概览与脉动 | [Atlas 契约](ATLAS_WORKSPACE.md) |
| AI 雷达 | 80 软件 + 60 模型 + 20 数据集；双视角各 80 个编号目标；任务筛选、分区聚焦、来源证据、同类对比、试用导出、本机关注 | [雷达契约](AI_RADAR.md) |
| 统一展示 | 双语品牌、明暗模式、一/两屏；地图全屏、雷达展开及返回；移动端自然流、键盘和减少动态效果 | [复用基线](../design/baselines/observatory-radar-1.3.2.md) |
| 开源星系 | 19,771 个代码仓库 + 24,000 个模型/数据集/应用节点；记录与推断分离；任务搜索、3 项清单、3 跳内路径、月度证据与报告导出 | [星系契约](OPEN_GALAXY.md) |
| Agent 情报室 | 情报浏览、知识整理、深度研究与报告交付；vLLM/SGLang 编辑案例；本机保存，DSH 运行待部署 | [当前流程](INTELLIGENCE_WORKFLOW.md) · [知识契约](RESEARCH_SPACE.md) |
| 共建社区 | 项目愿景、四模块概念动态图、路线与参与入口；可暂停，尊重减少动态设置 | [共建契约](COMMUNITY_HUB.md) |
| 数据与发布 | 固定版本来源摘录、OpenDigger 月度样本、官方事件采集与独立人工审核，静态快照与 Pages | [数据契约](DATA_CONTRACTS.md) · [运维](OPERATIONS.md) |
| 仓库协作 | 双语入口、需求/缺陷/纠错/体验/事件表单、Agent 上下文、PR 验收与交接 | [贡献指南](../CONTRIBUTING.zh-CN.md) · [Harness](HARNESS.md) |

历史版本与被替代的界面见 [演进记录](HISTORY.md)、[完成计划](plans/README.md) 和 [第一版交付](releases/first-edition.md)，不作为当前待办恢复。物理触屏与 PDF 打印尚未验证。

## 仍需共同完成

| 边界 | 当前事实 | 后续入口 |
| --- | --- | --- |
| 全域数据与可比性 | 月度指标仍为 20 个精选仓库；独立全球总量、地域榜、组织/发布者样本不能混加 | [#9 月度地域契约](https://github.com/X-lab2017/open-dipper/issues/9) · [#4 全域覆盖](https://github.com/X-lab2017/open-dipper/issues/4) |
| 启动与故障恢复 | 主入口仍将 12 个快照一起加载；失败进入整页重试，尚未完成全部运行时验证与局部降级 | [#10 加载与恢复](https://github.com/X-lab2017/open-dipper/issues/10) |
| 来源覆盖与时效 | 采集目标每 30 分钟、前端每 5 分钟检查部署快照；没有流式推送或硬实时 SLA | [#11 审核完整性](https://github.com/X-lab2017/open-dipper/issues/11) · [#15 来源接入](https://github.com/X-lab2017/open-dipper/issues/15) |
| 雷达采用判断 | 160 个候选是有来源身份；指标覆盖不齐，圈层与建议为可关闭的固定模拟；无独立任务评测 | [#16 证据关联](https://github.com/X-lab2017/open-dipper/issues/16) · [#18 编辑规则](https://github.com/X-lab2017/open-dipper/issues/18) |
| 地理与设施 | 地域指标、组织总部、发布方与会址各有来源和样本边界；模拟脉动单独标识。全局设施清单、政策适配器仍待独立证据 | [#22 模型后续](https://github.com/X-lab2017/open-dipper/issues/22) |
| 账户与商业服务 | 关注、草稿、导出仅在本机；未实现支付、权益、通知投递、云端同步或自动 Agent 研究 | [#17 服务边界](https://github.com/X-lab2017/open-dipper/issues/17) |
| 仓库许可 | 尚未选定根 LICENSE；代码、数据、几何与品牌各有权利边界 | [#6 许可决策](https://github.com/X-lab2017/open-dipper/issues/6) · [RIGHTS](RIGHTS.md) |

## 从哪里参与

第一次参与可从 [#12 来源目录](https://github.com/X-lab2017/open-dipper/issues/12)、[#13 双语术语](https://github.com/X-lab2017/open-dipper/issues/13)、[#19 来源与样刊材料](https://github.com/X-lab2017/open-dipper/issues/19) 开始。先查看负责人、评论和关联 PR，再说明准备贡献的范围。

工程优先级和阶段门槛以[路线图](../ROADMAP.zh-CN.md)及 [#8](https://github.com/X-lab2017/open-dipper/issues/8) 为准。Agent 从 [AGENTS.md](../AGENTS.md) 进入，再按 [任务索引](CONTEXT.json) 只读取相关契约；历史提案与完成计划不属于默认上下文。

## 五模块宣传片

OpenDipper-Promo v4 基于已发布 1.15.1，58 秒全深色画面，先总览后展开五模块与 vLLM / SGLang 编辑案例。全域数据基础与当前雷达收录量分列，DSH 待接入状态保留。脚本、压缩素材、字幕、来源与验证见 [宣传片说明](../media/promo/README.md)；MP4 与源包作为文件交付，不提交大型视频到 Git。
