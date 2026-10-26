<!-- section:overview -->
# OpenDipper 路线图

[English](ROADMAP.md) | **简体中文**

规划基线：**2026-10-26（Asia/Shanghai）**。这是带验收门槛的建议顺序，不是发布日期承诺或已实现功能清单。[当前状态](docs/STATUS.md) 说明已有能力，[统筹 issue #8](https://github.com/X-lab2017/open-dipper/issues/8) 关联后续工作。任务进度以 issue/PR 为准。R1–R3 是规划阶段，不是应用版本，也不是已配置的 GitHub Milestone。

**已接受产品基线：** 应用 1.3.2 已提供多图层观测站与 160 候选 AI 雷达，以及本机关注、订阅方案与样刊框架。参见[可复用基线](design/baselines/README.md)与[雷达契约](docs/AI_RADAR.md)。收费服务、Agent 研究、投递与更完整证据仍是后续工作。见[契约](docs/INTELLIGENCE.md)、[交付 #14](https://github.com/X-lab2017/open-dipper/issues/14) 和 [#15 来源](https://github.com/X-lab2017/open-dipper/issues/15)、[#16 证据](https://github.com/X-lab2017/open-dipper/issues/16)、[#17 服务](https://github.com/X-lab2017/open-dipper/issues/17)、[#18 编辑](https://github.com/X-lab2017/open-dipper/issues/18)、[#19 首份内容](https://github.com/X-lab2017/open-dipper/issues/19)。既有 R1 门槛仍待完成。

<!-- section:direction -->
## 发展方向

建设一个可信、可使用、可查证、可持续共建的全球开源生态观测站。保留地图 / 地球 / 快讯、已接受的视觉基线和一屏 / 两屏展示，在此基础上完善数据质量、可靠性与参与机制。

| 用户 | 希望支持的结果 |
| --- | --- |
| 研究者与生态观察者 | 在明确范围、周期和原始证据的前提下，比较参与、贡献量代理与影响力 |
| 社区编辑与领域专家 | 推荐有用来源和事件，核对准确性并纠正错误 |
| 演讲者与教育工作者 | 在大屏解释可复现的视图，并分享其上下文 |
| 开发者与工程 Agent | 接手范围明确、契约与样例齐备、可检查和评审的任务 |

当前 20 个仓库样本和 3 个近一年地域标签不代表全球覆盖。扩大覆盖需要导出证据与口径定义，不能仅靠地图上增加节点。

<!-- section:phases -->
## 三个阶段

| 阶段 | 重点工作 | 进入下一阶段的证据 |
| --- | --- | --- |
| **R1 · 可靠基础与参与入口** | 月度地域契约和试点说明；输入校验与故障恢复；完整、有界的人工事件读取；来源目录与术语 | #9–#13 满足验收；故障/恢复可复现；来源与覆盖边界明确。广泛邀请代码复用或发布新数据前，解决 #6 中适用的权利决定 |
| **R2 · 有证据的数据扩展** | 授权月度地域试点、更广仓库目录、分片和可复用来源适配器；健康与性能基线；渐进拆分模块 | 可追溯真实试点通过契约和范围检查；未知与排除项可见；数据体积/加载实测支持每次扩容；适配器有可重放样例 |
| **R3 · 分析、分享与持续使用** | 同口径地区/项目视图、可分享视图状态、有证据的摘要与演示场景；经评估的 AI 辅助 | 用户能复现分享视图，将结论追溯到来源与周期；代表性研究/演示任务通过评审；AI 辅助产物可追溯、可纠正 |

R1 的可靠性和入门任务不依赖真实新数据，可独立推进。R2 真实数据发布依赖授权导出和已接受契约。R3 的对比分析依赖可比较的 R2 数据；验收明确、可独立完成的易用性工作可以提前。

<!-- section:architecture -->
## 项目框架如何继续完善

以下是对[当前架构](docs/ARCHITECTURE.md)的建议扩展，不是已具备能力。

| 领域 | 接下来加强的边界 | 何时进一步扩展 |
| --- | --- | --- |
| 数据 | 月度地域与年度标签分开建契约；校验生产和消费边界；明确 schema/来源版本、覆盖与未知值 | 授权试点实测后增加目录 manifest 和分片；不把全域原始活动一次加载到浏览器 |
| 事件 | 人工队列完整且有界分页；来源元数据、可重放适配器、明确完整性/错误状态 | 质量与恢复检查后扩充官方来源；实体和地理关联需要证据，不能推断项目总部 |
| 前端 | 渐进拆出加载/校验、状态/筛选和面板职责，保持现有行为与 tokens | 用契约和浏览器验收支持多人协作；不以再做一轮视觉重构为前提 |
| 运维 | 测量来源成功时间、发布到采集延迟、截断、新鲜度与加载成本 | 仅当实测容量或共享编辑需求需要时，才通过 ADR 和迁移计划考虑对象存储、worker、队列或数据库 |
| Agent 工程 | 保持任务说明、样例、验收映射和失败证据易于查找 | 对反复发生的错误补精确依赖/契约检查；明确权限、隔离、评估和恢复后再考虑自动调度 |

只要满足实测需求，就继续使用静态快照与 Pages。本路线不承诺流式推送、账号系统、共享编辑后台或自主合并。AI 摘要、分类和地点建议，先做可追溯的离线评估，并保留人工纠错途径。

<!-- section:first-tasks -->
## 首批工作包

以下任务在本基线中已明确范围、尚未指定负责人，开始前先看实时状态。建议首批工程任务是 **#9、#10、#11**；**#12、#13** 是小型社区入门任务。它们是独立任务，不要求同时启动多个 Agent。

| Issue | 交付内容 | 依赖 / 适合参与者 |
| --- | --- | --- |
| [#9 月度地域契约](https://github.com/X-lab2017/open-dipper/issues/9) | Schema 提案、缺失/未知语义、样例与试点输入清单 | 数据维护者 + 开发者/Agent；合成样例可先做，真实接入待导出证据 |
| [#10 加载校验与恢复](https://github.com/X-lab2017/open-dipper/issues/10) | 校验边界、可见故障状态与浏览器恢复证据 | TypeScript 开发者/Agent；不需要新的上游数据 |
| [#11 人工事件分页](https://github.com/X-lab2017/open-dipper/issues/11) | 有界 issue/历史读取、完整性门槛与撤回/重审测试 | Python 开发者/Agent；模拟网络响应，保留审批规则 |
| [#12 来源目录](https://github.com/X-lab2017/open-dipper/issues/12) | 9 个已配置来源的可读清单及新增来源提案样例 | 首次贡献；Markdown 与来源文档阅读 |
| [#13 双语术语](https://github.com/X-lab2017/open-dipper/issues/13) | 8 个以现有契约为依据的通俗术语 | 首次贡献；文档与翻译评审 |

较大主题继续使用 [#4 数据覆盖](https://github.com/X-lab2017/open-dipper/issues/4)、[#5 事件质量](https://github.com/X-lab2017/open-dipper/issues/5) 和 [#6 权利确认](https://github.com/X-lab2017/open-dipper/issues/6)。子任务完成不代表整个主题完成。R2/R3 的想法在范围、输入和验收明确后，再转为实施 issue。

<!-- section:participation -->
## 从适合自己的位置参与

- **提出需求**：使用[需求表单](https://github.com/X-lab2017/open-dipper/issues/new?template=feature_request.yml)，描述场景与期望结果，无需写工程方案。
- **提供证据**：评审来源质量、指标解释、翻译、可访问性或演示体验，在相关 issue 反馈。有来源的事件通过[编辑表单](https://github.com/X-lab2017/open-dipper/issues/new?template=ecosystem-event.yml)提交，继续独立审核。
- **接手任务**：先检查是否已有负责人/PR，再留言说明小范围计划，并遵循[贡献指南](CONTRIBUTING.zh-CN.md)。#12、#13 已标记 `good first issue` / `help wanted`；这些标签是参与提示，不授予执行权限。
- **使用 Agent 实施**：从 [AGENTS.md](AGENTS.md) 和 [Harness 工作流](docs/HARNESS.md) 开始。维护者决定方向和验收，授权协作者启动执行。新建 issue 不会自动启动后台 Agent。

维护者在 issue 中维护任务范围与评审反馈，在有评审时间时回应参与计划并说明下一步；目前没有响应时限 SLA。跨模块或跨会话工作使用[版本化执行计划](docs/plans/README.md)，关闭任务前链接已落地改动和实际验证。

<!-- section:decisions -->
## 需要逐步补齐的输入与决定

| 输入 | 在哪里明确 | 同时可推进的工作 |
| --- | --- | --- |
| 应用/文档许可、贡献条款，以及独立的品牌/数据权利 | [#6](https://github.com/X-lab2017/open-dipper/issues/6) | 规划、评估及已有授权内的明确任务；不虚构许可授予 |
| 第一份月度地域导出：位置/样例、字段、周期、人群/未知值、允许用途 | [#9](https://github.com/X-lab2017/open-dipper/issues/9)，再到 [#4](https://github.com/X-lab2017/open-dipper/issues/4) | 契约设计与明确标识的合成样例 |
| 优先用户、真实场景和来源覆盖 | [#8](https://github.com/X-lab2017/open-dipper/issues/8) 及需求/来源提案 | 当前可靠性与文档任务 |
| 评审容量与任务负责人 | 各实施 issue | 未认领任务继续开放；不虚构负责人或截止日期 |

<!-- section:scorecard -->
## 用结果衡量进展

阶段评审时附上数据窗口、分母和证据。以下是建议测量项，不是已经采集的结果或承诺目标。

| 维度 | 需要收集的证据 |
| --- | --- |
| 覆盖 | 可比较的平台/实体/周期、已知和未知地域、排除项；只有分母明确时才报告覆盖百分比 |
| 新鲜度 | 明确窗口内的来源成功距今时间、发布至首次采集延迟、失败/触及上限次数；采集与部署延迟分开 |
| 正确性 | 契约样例、缺失/零区分、完整/部分读取协调、恢复与来源检查 |
| 性能 | 指定设备/网络条件下的快照/分片体积和浏览器启动/操作结果；测量后再设预算 |
| 参与 | 需求澄清、有证据的任务完成、首次贡献和评审耗时；不把 issue/PR 数量直接等同于影响 |
| 有用性 | 研究者、编辑或演讲者能完成代表性任务，并解释结果能说明与不能说明的内容 |

<!-- section:references -->
## 路线图的维护方式

优先级或阶段门槛变化时同步中英文。任务进度留在 issue，当前事实留在 [STATUS](docs/STATUS.md)，设计理由留在 [DECISIONS](docs/DECISIONS.md)，交付证据留在 [HISTORY](docs/HISTORY.md)，避免多处复制不断变化的任务勾选表。

2026-10-25 参考：[OpenAI Harness engineering](https://openai.com/index/harness-engineering/)、[GitHub 参与指南](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)、[CNCF 新贡献者任务指南](https://contribute.cncf.io/projects/best-practices/templates/issue-labels/)。上述阶段与优先级是基于当前源码和契约的 OpenDipper 项目建议，不代表外部认证。本轮使用 AI 辅助检查仓库、编写任务说明并整理路线图。
