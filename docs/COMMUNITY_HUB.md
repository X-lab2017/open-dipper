# 共建社区 / Community — 项目介绍与开放协作

1.15.0 · 2026-10-27。维护者已接受内容介绍与动态叙事方向，替代 1.14 的三栏任务办理界面。保留 `#contribute` 和“共建社区 / Community”导航。具体发布结果见关联 PR / Actions。

## 阅读路径与内容

1. **认识项目**：愿景“让开放世界的变化，成为每个人可用的知识”。四个可点击模块用原创 SVG 和共享光带连接：全球观测、AI 雷达、开源星系、Agent 情报室。图形为概念演绎，不代表实时数据或已经实现的自动上下文传递。
2. **理解价值**：生态可见、判断有据、知识共建。链接 OpenDigger / OpenRank、OpenShare / GOSD 来源与数据契约，不混用统计期与范围。
3. **了解路线**：看见与发现、阅读与研究为已提供能力；可信 Agent 为下一阶段，持续协作为未来方向。可展开各阶段的当前边界并查看权威文档；没有承诺日期或虚构进度百分比。
4. **加入共建**：使用反馈进入 #35，数据知识贡献进入贡献指南，设计开发进入 Issues。下方提供 GitHub、贡献指南、AGENTS、路线图、权利、安全报告和 OpenShare 入口。
5. **信息披露**：X-lab 公共建设与 OpenShare 商业服务分工，AI 工程协作，根应用 LICENSE 尚未选定，数据/地图/品牌独立权利边界。未新增付款、账户、服务承诺或背书。

原表单、草稿、复制按钮、任务导航与成果卡片退出该页面。此前草稿仅驻留页面 JS 会话，无持久存储或数据迁移；知识库、研究报告与其他模块状态不受影响。协作记录仍保存在 GitHub。

## 动态与交互

- 地球经纬线与观测光点、雷达扫弧、关系星群、来源到报告图形由代码绘制，无外部图库或新增依赖。
- 模块悬停/键盘聚焦显示轻微强调；点击跳转对应产品页。每个模块有可读名称和说明，SVG 作为装饰不重复朗读。
- 独立播放/暂停按钮；系统减少动态时禁用动画并显示状态。图形离开视窗或页面不可见时暂停；离开模块时清理观察器与事件监听。
- 桌面四模块横向连续构图，手机两列；内容自然纵向阅读。沿用共享明暗 tokens、中英切换、可见焦点。
- 路线阶段用状态文字和实心/空心标记共同表达，详情按需展开。共建按钮可跳至参与区并设置焦点。

## 当前能力边界

情报室的本机知识与编辑报告不等于真实模型研究。DSH 适配代码已准备，独立服务、模型和实际运行验证尚未完成。共享工作区、云同步和通知投递仍是未来方向。详见[当前状态](STATUS.md)、[情报室流程](INTELLIGENCE_WORKFLOW.md)与[服务说明](../services/research/README.md)。

## 实现与验证

`src/community/view.ts` / `community.css` 负责内容和动态图；`src/observatory/portal.ts` 装配，现有 `data-page` 导航衔接四模块。无需后端、凭据、网络采集或本机数据读取。

`tests/community-ui.mjs` 纳入 `test:portal:ui`：四模块入口、无表单、路线详情、外链、播放暂停、离屏暂停、系统减少动态、两种语言与主题、手机宽度和跨模块返回。执行 typecheck、npm test、build，并以 CI 截图进行视觉核对。CI 通过不等于完整无障碍认证。

## English handoff

Community is an About-style narrative: mission, an animated four-module concept illustration, public values, a candid roadmap, contribution invitations and project disclosures. It replaces the previous task-form interface. Existing routes and other module state remain intact. SVG/CSS motion can be paused, stops offscreen/when hidden and respects reduced motion. The illustration is conceptual; DSH runtime, shared workspaces and notifications are not presented as deployed capabilities. Participation links lead to GitHub without automatically posting or reading private notebook content.
