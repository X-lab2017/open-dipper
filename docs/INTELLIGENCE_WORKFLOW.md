# Agent 情报室：使用与协作 / Intelligence workflow

当前阶段：**1.13.0 产品交互阶段收尾，后端执行尚未交付**。2026-10-27（北京时间）核对。[PR #47](https://github.com/X-lab2017/open-dipper/pull/47) 已合并，[构建、浏览器验收与 Pages 部署](https://github.com/X-lab2017/open-dipper/actions/runs/40498062877)成功。阶段收尾不代表所有未来能力完成，也不宣称整站没有其他开放任务。

## 产品分工

| 入口 | 用户目的 | 当前能力 | 边界 |
| --- | --- | --- | --- |
| 情报浏览 / Intelligence | 先阅读，产生问题 | 资料库、列表、阅读三栏；分类、筛选、收藏、已读和收录 | 来源摘录与元数据，不保证全文；无阅读端实时 AI 解读 |
| 知识整理 / Knowledge | 为一个问题组织依据 | 本机多课题、资料勾选、问题草稿、可编辑笔记和导出 | 非云端知识库；无文件解析、向量检索或 Open Notebook 后端 |
| 深度研究 / Research | 用选定资料形成可审阅交付物 | 问题与资料、报告、审阅交付；编辑、引用、导出、回存知识库、近期成果 | DSH 适配代码存在；公开站无运行服务，不能执行实时研究 |

前三个模块负责发现对象与生态线索；情报室负责阅读、整理与交付。来源集合包含已有观测、事件和有界采集目录，并不意味着全域索引。跨模块“研究此对象”的自动上下文传递尚未打通。订阅、持续监测、通知投递与协作账户是后续能力，旧跟踪仅为历史演示。

## 可复现的案例路线

从[案例入口](https://www.x-lab.info/open-dipper/#briefing?tab=signals&case=inference)开始：

1. 打开 **vLLM / SGLang 案例资料**，阅读六条来源：两个固定提交的 README、两篇版本化论文、两条发布记录。查看原文与日期，不把收录日当成观测期。
2. 点击 **收录到知识库**，进入案例知识整理。选择本次需要的来源；取消勾选的资料不应进入新任务。
3. 点击 **带入深度研究**，检查问题与依据。未配置网关时，“运行”禁用；选择 **查看案例完整报告**才打开固定编辑示例。
4. 回查报告引用，阅读事实、比较、证据缺口和验证计划。结论不将跨论文加速倍数当成可比排名；没有开展性能实测。
5. 编辑报告，进入 **审阅与交付**，导出 Markdown 或可打印 HTML；打印为 PDF 取决于浏览器，不是站内 PDF 引擎。
6. 保存回知识库并再次打开，确认修改保留。普通资料整理、案例入口、旧笔记和历史草案均应可继续访问。

报告源文与界面语言独立：切换界面语言不会翻译或覆盖已编辑报告。知识库 JSON 是 OpenDipper 交换格式；深度研究交付格式为 Markdown / HTML。案例是编辑演示，不是模型运行记录。保存与近期成果仅在当前浏览器，不存在登录账户同步；清除站点存储前请导出。

## 给开发者和 Agent 的最短路径

先读 [AGENTS](../AGENTS.md)、[当前状态](STATUS.md)和[Harness](HARNESS.md)，再按任务读取下表。无需恢复早期可视化探索或历史订阅首页。

| 修改对象 | 权威说明 | 代码与验证 |
| --- | --- | --- |
| 阅读、收录和路由衔接 | [情报库](INTELLIGENCE_LIBRARY.md) | `src/intelligence-room/view.ts`；`tests/agent-room-ui.mjs` |
| 知识库与源上下文 | [知识工作区契约](RESEARCH_SPACE.md) | `notebook.ts`、`notebook-model.ts`；`tests/notebook-ui.mjs` |
| 研究与交付 | 本文、[执行记录](plans/knowledge-dsh-flow.md) | `research-flow.ts`、`research-report.ts`、`research-flow.css`；`tests/research-flow.test.mjs`、`tests/research-flow-ui.mjs` |
| 官方来源与案例内容 | [案例记录](plans/inference-case.md) | `inference-case.ts`；保留源 URL、固定版本、事实/推断/待测区分 |
| DSH 服务端 | [接入与部署说明](../services/research/README.md) | `services/research/runner.mjs`、`server.mjs`；生命周期测试使用测试替身，不证明上游模型运行 |

以上未带目录的 TS/CSS 文件位于 `src/intelligence-room/`。规范命令见[开发指南](DEVELOPMENT.md)：修改交互时运行 typecheck、相关单元测试、构建与 `test:portal:ui`；文档修改运行 `docs:build` / `docs:check`。端到端检查覆盖阅读→收录→精确来源选择→编辑报告→导出→回存、旧内容兼容、双语主题与手机布局。

状态分别存于 `od:reader-v1`、`od:notebooks-v1`、`od:deep-research-v1`、`od:deep-research-history-v1`；旧 `od:agent-room-v2` 保留。历史成果上限 10；笔记/资料上限见知识工作区契约。不要通过清空本机数据“修复”迁移或切换问题。保存失败需提示并允许导出。

## 接通 DSH 前的交接门槛

现有客户端可对配置的网关发起研究，服务端适配官方 SDK；当前公开部署没有配置运行服务。下一位协作者应按服务端 README：

- 构建并核对固定上游 SDK，部署独立运行环境和经审阅的限制配置；配置模型、鉴权与访问边界。密钥不进入 Pages、Git 或浏览器。
- 在实际运行环境验证一次成功运行、取消、超时、错误与无效引用；保留真实运行证据。现有测试替身不能替代此验证。
- 输出必须关联原问题与来源，失败不得替换成演示报告；有引用不等于引用支持结论，成果仍须审阅。
- 运行权限、成本上限、日志与数据保留明确后，再启用公开入口。账户隔离、共享知识与定时跟踪各自另定范围。

## 反馈回到产品

一般试用反馈进入 [#35](https://github.com/X-lab2017/open-dipper/issues/35)：用户原本想完成什么、停在哪一步、预期结果和可公开的证据。明确缺陷或数据纠错先搜索现有 issue，再使用[贡献指南](../CONTRIBUTING.zh-CN.md)中的表单。不要自动上传私人笔记、完整报告或对话。

[共建社区](COMMUNITY_HUB.md)介绍项目愿景、路线与协作方式，并提供反馈、资料和开发的 GitHub 入口。不会自动接单、调用 Agent 或接受资料。成果从 Issue / PR、检查与发布记录追溯。

## English handoff

The 1.13 interaction milestone is published. Intelligence reads evidence; Knowledge organizes browser-local notebooks; Research scopes a question and supports a cited editorial report, editing, Markdown/printable HTML export and save-to-notebook. Folo and Open Notebook are product references, not embedded backends. DSH is the selected execution direction; the adapter is implemented but no runtime/model deployment or live execution is verified. Existing notebooks and legacy drafts remain available. Follow the linked contracts and tests; do not mistake historical designs or planned Community features for current capabilities. Feedback goes to #35, with public sharing explicitly chosen by the user.
