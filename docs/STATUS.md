# 当前状态 / Current status

基线日期：**2026-10-25**。本页描述该次整理时的状态；实际数据新鲜度看部署快照，任务最新状态看关联 issue。

## 已落地

- 产品架构 v1：地图 / 地球 / 快讯，独立月度分析、证据查看、自动采集与人工审核事件；静态发布与最后成功快照保留。
- 视觉基线 **1.2.0**：X-lab 官方标志、共享 CSS/Canvas tokens、默认地图、海陆层次和海岸微光、点阵/轮廓、惯性平移和缩放定位；地球保留光照、大气辉光与惯性操作。
- 桌面默认一屏总览，可切换两屏演示和全屏；≤1000px 自然滚动。紧凑顶栏和面板减少占用，官方标志与产品字标协调。
- 中文/英文、深色/浅色、键盘与减少动态效果；保留分析页和历史全景兼容路由。
- AI 协作入口、公开协作说明、任务上下文索引、文档一致性检查、issue/PR/交接模板已纳入知识库。
- README 与贡献指南采用英文默认、中文独立入口；业务/技术 Mermaid 图帮助理解产品。按 [Harness 工作流](HARNESS.md) 区分人类需求入口与 Agent 工程执行，加入执行计划、验收映射和双语一致性检查。Agent 目前由协作者启动，未配置自动 issue 调度。

应用 `package.json` 版本为 **1.0.0**；视觉资源 `design/tokens.json` 版本为 **1.2.0**。它们是不同的版本轴，本文没有声明已创建对应 Git tag 或 GitHub Release。

## 验证证据

地图与大屏基线提交：[3862477](https://github.com/X-lab2017/open-dipper/commit/38624774e7f65907947481082676d67da0aedace)。对应 [Actions 运行](https://github.com/X-lab2017/open-dipper/actions/runs/40152382147) 已通过确定性检查、生产构建、三套 Chromium 验收和 Pages 部署。本轮文档整理的提交与验证见下方知识库 issue；不要把上一轮 CI 当作新改动的验证。

入口：[观测站](https://www.x-lab.info/open-dipper/) · [视觉规范页](https://www.x-lab.info/open-dipper/design-system.html) · [Actions](https://github.com/X-lab2017/open-dipper/actions)

## 仍然存在的边界

| 主题 | 当前能力 | 尚未完成 |
| --- | --- | --- |
| 月度指标 | 20 个精选仓库、4 平台、6 指标 | 全域覆盖、可比较的全球月度地域聚合 |
| 真实地域 | Microsoft / Apache / PyTorch Foundation 三个标签的独立近一年分布 | 精确起止、未知国家分母；均不能自行补造 |
| 事件 | GitHub releases、OpenSSF/CNCF RSS、审核 issue | 更完整来源、自动实体/地理解析、来源质量评估 |
| 演示 | 13 个固定虚构事件和模拟地域指标 | 不作为真实统计，日期不随部署刷新 |
| 时效 | 事件目标每 30 分钟采集，前端每 5 分钟检查部署快照 | 无流式推送或硬实时 SLA |
| 协作 | GitHub 审核、本地关注与草稿 | 无共享账户后台、云端草稿或多人实时编辑 |
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
<!-- issue-index:end -->

接手时先看 issue 的最新状态、关联提交和验收条件。更多背景见 [演进记录](HISTORY.md)、[决策记录](DECISIONS.md) 和 [开发指南](DEVELOPMENT.md)。
