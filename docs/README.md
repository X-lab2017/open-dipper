# 文档导航 / Documentation

这里承载当前约定、演进理由与协作上下文。新参与者不需要重读聊天记录，也不需要一次性读取全部文件。

| 目标 | 阅读顺序 |
| --- | --- |
| 了解产品和下一步 | [当前状态](STATUS.md) → [评审路线](REVIEW.md) → 关联 issue |
| 选择参与任务与理解优先级 | [中文路线图](../ROADMAP.zh-CN.md) / [English](../ROADMAP.md) → [统筹 #8](https://github.com/X-lab2017/open-dipper/issues/8) → 已明确范围的任务 |
| 了解业务和技术结构 | [英文首页](../README.md) / [中文首页](../README.zh-CN.md) 的两张结构图 → [架构](ARCHITECTURE.md) |
| 提出需求 | 首页需求入口 → 使用场景与期望结果 → 维护者/Agent 补全工程任务 |
| 人类开发者开始贡献 | [中文贡献指南](../CONTRIBUTING.zh-CN.md) / [English](../CONTRIBUTING.md) → [开发指南](DEVELOPMENT.md) → 对应源文件 |
| Agent 接手任务 | [AGENTS.md](../AGENTS.md) → [结构化索引](CONTEXT.json) → 任务对应契约与检查 |
| 理解工程协作方式 | [Harness 工作流](HARNESS.md) → [执行计划](plans/README.md) → 验收证据与交接 |
| 修改布局、地图、地球或组件 | [视觉规范](VISUAL_SYSTEM.md) → [架构](ARCHITECTURE.md) → [设计资源](../design/README.md) |
| 接入数据与事件 | [契约索引](DATA_CONTRACTS.md) → 对应契约 → [运维](OPERATIONS.md) |
| 设计全球观测对象与图层 | [观测图层提案](OBSERVATION_LAYERS.md) → [参考类型与图层目录](design/README.md) → [#22](https://github.com/X-lab2017/open-dipper/issues/22)；提案不是已上线能力 |
| 理解为何这样设计 | [演进记录](HISTORY.md) → [决策记录](DECISIONS.md) |
| 查看历史界面与首页展示原图 | [视觉演进图档](archive/2026-10-25-visual-evolution.md) → 三个阶段的原始截图 |
| 清理或移除旧功能 | [维护与清理](MAINTENANCE.md) → 使用位置和兼容性测试 |
| 交接或提交 PR | [交接模板](templates/HANDOFF.md) → [PR 模板](../.github/PULL_REQUEST_TEMPLATE.md) |
| 核对复用条件 | [权利与许可状态](RIGHTS.md) → 各资源原始 notice |

## 文档如何保持可信

- **当前事实**：`STATUS.md` 记录有日期的产品基线和已验证证据；动态来源状态以运行中的 JSON 和 Actions 为准。
- **规范与契约**：视觉规范、数据契约和 AGENTS 分别维护各自主题。源代码与测试验证实现；若不一致，在同一 PR 修正，不能用文档覆盖实际失败。
- **历史与理由**：`HISTORY.md` 及 `DECISIONS.md` 记录里程碑和取舍。旧进度移到 `archive/`，保留当时结论，不当作当前待办。
- **待办**：GitHub issue 是任务状态来源。完成后关闭并链接提交与验证；文档只提供入口，不维护第二套独立任务状态。
- **生成索引**：`CONTEXT.json` → `npm run docs:build` → 根与站点 `llms.txt`、站点 `agent-context.json`。`npm run docs:check` 检查镜像、相对文件链接和任务命令；不验证网络链接、Markdown 锚点、引用式链接或外部事实；原样保留的上游品牌 notice 使用上游路径，单独豁免本地链接检查。
- **多语言入口**：英文 `README.md` 为默认首页，中文在 `README.zh-CN.md`；贡献指南同样分开。`CONTEXT.json.translations` 登记语言对应关系。检查互链、章节 ID、链接目标、代码块和 Mermaid 图结构；翻译含义仍需复核，深入文档暂保留各自维护语言。
- **执行计划**：复杂或跨会话工作按 [plans/README.md](plans/README.md) 保存步骤、决定和检查点；不要求普通需求提交者写技术计划，issue 仍是任务状态来源。

更新原则：行为、契约或决策变化时，同一提交更新权威文档；普通采集刷新不需要修改叙述性状态日期。不要提交私人会话、原始鉴权响应或重复的长篇总结。

## AI and open-source intelligence

Read [INTELLIGENCE.md](INTELLIGENCE.md) for the portal routes, shared evidence model, local subscription preview, fixed fixtures and contributor tasks. The [execution plan](plans/intelligence-portal.md) records the 1.1.0 delivery.
