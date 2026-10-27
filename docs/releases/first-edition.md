# 第一版交付与协作接手

记录日期：2026-10-28（北京时间）。维护者确认五模块第一版交互与宣传片完成，本轮整理文档、开发体验与过程记录。应用版本保持 **1.15.1**；这是产品阶段收尾，不是新的 tag 或 GitHub Release。当前事实看 [STATUS](../STATUS.md)，任务是否开放看实时 issue/PR。

## 产品闭环

| 模块 | 用户得到什么 | 接手入口 |
| --- | --- | --- |
| 全球观测 | 地图／地球上的多层观测、五站巡航、榜单与生态脉动 | [Atlas](../ATLAS_WORKSPACE.md) |
| AI 雷达 | 按任务发现候选、核对来源、比较并导出试用清单 | [Radar](../AI_RADAR.md) |
| 开源星系 | 探索记录关系、建立候选清单、沿证据路径生成报告 | [Galaxy](../OPEN_GALAXY.md) |
| Agent 情报室 | 情报浏览 → 知识整理 → 深度研究 → 编辑、导出并保存报告 | [当前流程](../INTELLIGENCE_WORKFLOW.md) |
| 共建社区 | 了解平台、愿景与路线，提交反馈、来源或代码贡献 | [Community](../COMMUNITY_HUB.md) |

首次演示建议从 [vLLM / SGLang 案例](https://www.x-lab.info/open-dipper/#briefing?tab=signals&case=inference) 开始：六份官方来源 → 收录与勾选 → 带入研究 → 打开完整编辑示例 → 回查引用与导出。报告是编辑演示，不是实时 DSH 执行或框架性能评测。后续反馈集中于 [#35](https://github.com/X-lab2017/open-dipper/issues/35)。

## 演进与证据

| 阶段 | 反馈带来的变化 | 可追溯交付 |
| --- | --- | --- |
| 1.6 | 在紧凑布局中完善地图居中、观察面板和环球巡航 | [里程碑](1.6.0.md) |
| 1.7–1.9 | 扩充多类情报来源并探索时间、主题、线索交互 | [完成计划](../plans/README.md)；探索 UI 后被专注阅读替代，来源资产仍使用 |
| 1.11 | 以资料库／列表／阅读三栏降低阅读负担，Agent 交互移出阅读页 | [PR #44](https://github.com/X-lab2017/open-dipper/pull/44) |
| 1.12–1.13 | 从研究空间走向知识整理和研究交付，贯穿 vLLM/SGLang 案例 | [PR #45](https://github.com/X-lab2017/open-dipper/pull/45)、[PR #47](https://github.com/X-lab2017/open-dipper/pull/47)、[Pages 40498062877](https://github.com/X-lab2017/open-dipper/actions/runs/40498062877) |
| 1.15 | 共建从办理式表单转为有动态图的项目介绍、愿景与贡献入口 | [PR #50](https://github.com/X-lab2017/open-dipper/pull/50) |
| 1.15.1 | 五模块固定导航位置、移动端溢出修复、滚动与焦点一致 | [PR #51](https://github.com/X-lab2017/open-dipper/pull/51)、[Pages 40529952243](https://github.com/X-lab2017/open-dipper/actions/runs/40529952243) |
| 宣传片 v4 | 全深色、先总览再分模块、独立共建邀请，58 秒 | [PR #53](https://github.com/X-lab2017/open-dipper/pull/53)、[CI 40595980617](https://github.com/X-lab2017/open-dipper/actions/runs/40595980617)、[Pages 40596411391](https://github.com/X-lab2017/open-dipper/actions/runs/40596411391) |

宣传片 [制作源与复现](../../media/promo/README.md)、[素材来源](../../media/promo/assets.json)、[实测验证](../../media/promo/validation.json) 随库保存；MP4 与源包独立交付，大型导出不放 Git。历史验证保留，不用新日期覆写旧证据。

## “完成”的边界

- 完成的是可评审的五模块体验和案例交付，不是全域生产数据平台。独立全球统计、月度仓库样本、雷达 160 个身份和星系图的范围不同，不能混加。
- Folo、Open Notebook 等提供交互参考；当前前端不能被描述为已经部署这些完整服务。
- DSH 服务端适配代码已准备，真实运行、模型、认证代理和隔离验证未接通。浏览器中的编辑案例不得改称 AI 实时生成。接入门槛见 [服务端说明](../../services/research/README.md)。
- 收藏、课题与成果主要在本机；云同步、订阅投递、支付和服务权益未交付。清理浏览器前应导出。
- 根应用 LICENSE 尚待维护者决定；数据、几何、品牌与依赖各自权利仍须核对。见 [RIGHTS](../RIGHTS.md)。
- 浏览器 CI 覆盖不等于物理触屏、完整无障碍审计或 PDF 打印实测。未执行项不计入通过。

## 开发者与 Agent 接手

人类贡献者从 [贡献指南](../../CONTRIBUTING.zh-CN.md) 进入；Agent 从 [AGENTS](../../AGENTS.md) → [当前状态](../STATUS.md) → [任务索引](../CONTEXT.json) → [开发检查](../DEVELOPMENT.md) 进入。无需读完所有历史计划，也不要自动恢复已完成任务。

普通前端开发使用锁定依赖与版本化快照，不需要模型 key 或刷新数据。保留两种主题、两种语言、移动端、键盘、减少动态与兼容路由。修改文档索引后生成镜像，贡献 PR 记录真实验证；后续实施范围以用户授权和实时任务为准。

## 整理记录与运维观察

本轮将旧版过程从 STATUS 的当前能力叙述移出，修正 README 的旧里程碑突出位置，补入共建社区，更新 CHANGELOG 版本轴、阅读模块源码入口和五模块导航检查。未删除兼容路由、历史方案、用户资料或版本化数据。精简前的状态页可在 [PR #53 合并提交](https://github.com/X-lab2017/open-dipper/blob/05263887025cab06f7edcff905323d160655405b/docs/STATUS.md) 恢复。

核查发现 [定时运行 40596372369](https://github.com/X-lab2017/open-dipper/actions/runs/40596372369) 的检查与构建通过，归档快照时因 main 已前进而被 Git 拒绝推送，部署跳过；随后上表的 40596411391 发布成功。记录为并发推送冲突，不解释成数据测试失败；本轮未修改工作流或强推。再次发生时按 [运维指南](../OPERATIONS.md) 核对最新 main 与成功部署，避免把旧构建直接重试发布。

AI 协作披露：维护者提供目标与评审，Codex 整理仓库事实、文档、源码映射和工作流证据。此次收尾仅修改文档与生成上下文；最终 PR 记录本轮实际检查和合入状态。不公开私人对话或隐藏推理，不声称人工逐项验证了所有实现。
