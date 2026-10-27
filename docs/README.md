# 文档导航 / Documentation

先找当前能力，再读与你的任务有关的契约。无需重读聊天或全部执行计划。

| 你要做什么 | 最短阅读路径 |
| --- | --- |
| 了解产品与当前缺口 | [首页](../README.md) / [中文](../README.zh-CN.md) → [当前状态](STATUS.md) |
| 查看最新里程碑、截图或宣传片 | [1.6.0 发布记录](releases/1.6.0.md) → [图片来源](assets/README.md) / [短片制作](../media/promo/README.md) |
| 提建议、反馈、贡献资料或代码 | [贡献指南](../CONTRIBUTING.md) / [中文](../CONTRIBUTING.zh-CN.md) → 对应 issue 表单或已有任务 |
| 选择第一个任务 | [路线图](../ROADMAP.md) / [中文](../ROADMAP.zh-CN.md) → 实时 issue；文档不重复维护任务状态 |
| Agent 接手实现 | [AGENTS.md](../AGENTS.md) → [当前状态](STATUS.md) → [任务索引](CONTEXT.json) → [开发检查](DEVELOPMENT.md) |
| 修改全球观测 | [当前 Atlas 契约](ATLAS_WORKSPACE.md) → `src/atlas.ts` / `src/layers.ts` / 相关测试 |
| 使用或接手 Agent 情报室 | [当前流程与交接](INTELLIGENCE_WORKFLOW.md) → [知识整理](RESEARCH_SPACE.md) → [DSH 服务端](../services/research/README.md) |
| 修改共建社区 | [实现契约](COMMUNITY_HUB.md) → [贡献指南](../CONTRIBUTING.zh-CN.md) → [Harness](HARNESS.md)；项目介绍、愿景、路线和参与方式 |
| 修改 AI 雷达 | [当前雷达契约](AI_RADAR.md) → `src/radar/` / 固定来源摘录 / 相关测试 |
| 修改开源星系 | [星系契约](OPEN_GALAXY.md) → `src/galaxy/` / [图数据来源](../public/data/galaxy/README.md) |
| 开发下一模块或复用视觉 | [基线索引](../design/baselines/README.md) → [模块模板](templates/OBSERVATORY_MODULE.md) → [视觉规范](VISUAL_SYSTEM.md) |
| 接入数据或事件 | [数据契约索引](DATA_CONTRACTS.md) → [来源证据](DATA_EVIDENCE.md) / [事件契约](EVENTS.md) → [运维](OPERATIONS.md) |
| 理解工程结构与协作 | [架构](ARCHITECTURE.md) → [Harness](HARNESS.md) → [PR 模板](../.github/PULL_REQUEST_TEMPLATE.md) |
| 参与产品评审 | [评审路线](REVIEW.md) → 具体任务和截图/复现 → issue |
| 理解演进与历史方案 | [历史](HISTORY.md) → [决策](DECISIONS.md) → [历史档案索引](archive/README.md) |
| 清理或退役内容 | [维护规则](MAINTENANCE.md) → 引用与兼容检查 → 可恢复记录 |
| 交接未完成任务 | [执行计划](plans/README.md) → [交接模板](templates/HANDOFF.md) |
| 核对资源复用或敏感报告 | [权利说明](RIGHTS.md) / [安全说明](../SECURITY.md) |

## 哪份内容是权威来源

- **当前事实**：`STATUS.md` 是有日期的摘要，运行契约、源代码和测试解释当前行为。数据新鲜度看快照，任务状态看 GitHub issue。
- **规范**：`ATLAS_WORKSPACE.md`、`AI_RADAR.md`、`OPEN_GALAXY.md`、数据契约、视觉规范和 `AGENTS.md` 各自负责一个主题。出现不一致时检查实现并同一 PR 修复。
- **固定基线**：`design/baselines/` 保留已接受实现的提交与指纹；它不是不断变化的全站数据快照。
- **历史**：`HISTORY.md` 记录反馈、决定和交付；`archive/` 保存被后续版本替代的方案。短导航文件保留旧链接，旧方案不属于当前需求。
- **执行计划**：复杂/跨会话任务保留计划；完成后保留验收，不加入无关任务的默认阅读路径。
- **机器索引**：编辑 `CONTEXT.json`，运行 `npm run docs:build` 生成根/站点 `llms.txt` 与 `agent-context.json`。只按任务读取，不把整库当系统指令。
- **双语入口**：README、贡献指南、路线图同时更新两版。`docs:check` 检查结构、互链、代码块、图结构、任务路径与本地链接；不验证翻译含义、外部事实或网络链接。

文档整理沿革见 [维护记录](MAINTENANCE.md)。行为变化时同步更新契约、索引与验证；普通数据采集不需要改叙述日期。不要公开私人聊天或复制多份长期待办。
