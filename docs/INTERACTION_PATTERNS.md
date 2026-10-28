# 沿用的设计与交付经验 / Reusable interaction patterns

2026-10-28：根据会议分类、目录树、信息卡与实体符号迭代整理。适用于后续数据层扩展；不是新的布局改版要求。当前实现与来源见 [会议契约](CONFERENCES.md)，视觉源见 [视觉规范](VISUAL_SYSTEM.md)。

| 经验 | 后续默认做法 | 验收依据 |
| --- | --- | --- |
| 在原结构内渐进增强 | 保留五模块按钮位置、桌面一屏密度、地图主体和生态脉动；新增层级通过展开进入 | 与已接受版本对照，检查 1440px 桌面和 390px 手机，不只看单张大屏图 |
| 目录树 + 信息卡 | 树承担分类、多选和定位条目；卡承载原始日程、来源和细节。箭头展开与复选框选择独立，分类文字可单独查看 | 展开不改变地图选择；父项支持部分选中；无坐标条目仍能阅读 |
| 一份状态，多处展示 | 树、列表、地图、计数和最新活动共用模型；重绘保留输入、焦点和展开状态 | 左右双向选择、空选择、筛选组合、语言/主题切换、返回卡片 |
| 颜色与图形共同表达 | 共用 SVG/Canvas 图形和明暗配对 tokens，统一大小、线宽和对齐；面/泡/点保持数据语义 | 明暗各截图；不依赖颜色识别；聚合数字和面积编码不能混用 |
| 数据多，入口仍克制 | 使用分层目录、紧凑分类与渐进加载；默认 A+B/即将举办，历史与扩展分类可主动查看 | 新数据不重置用户选项；父类数为记录数，地图数只计可定位记录 |
| 数据事实先于视觉效果 | 原年份、源更新时间、采集时间和截止节点分别保留；线上/未知地点不猜坐标；冲突明确提示 | 保留原文和回链，检查旧日程、时区、模糊结束日、重复记录 |
| 失败可以恢复 | 固定来源与哈希、有限请求、校验后写入、失败保留上次成功快照；普通前端开发离线 | 日期/身份/URL校验、失败回滚测试；不以改日期伪造新鲜度 |
| 发布凭证分层 | 类型与数据检查 → 构建 → 浏览器交互及截图审阅 → Pages 部署结果 | 在 PR 记录精确 CI/Pages 链接；成功构建不等于已上线，不声称人工设备验收 |

复用前先读任务对应契约，保护已有信息和用户习惯。为变更的风险补充有意义的测试；动态数据数量从快照读取，视觉版本从 tokens 读取，不把本次快照数字或版本写死为未来测试前提。需要改变默认筛选或页面骨架时，作为明确产品变更评审。

**English:** Preserve the compact shell and existing information; use an independently expandable tree for selection and cards for detail; share filtering state across views; pair glyphs with theme tokens; retain evidence, clocks and uncertainty; validate bounded updates atomically; distinguish test, browser and deployment receipts. Counts and version assertions should follow their source of truth rather than a frozen release number.
