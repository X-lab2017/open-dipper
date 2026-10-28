# 会议与活动 / Conferences & events

1.17.0 接入 Conference Partner 公开 CCF 快照，并保留原有社区活动。入口是全球观测右侧“会议与活动”，不更改五模块导航或默认活跃开发者面板。

## 首批覆盖与来源

- 上游提交 `616a680ed180bec099d652c64eeae844a512a25f`，快照时间 2026-10-27T10:54:23Z，首次采集日 2026-10-28。
- 392 个唯一上游会议 ID：第三方标注 A 58 / B 132 / C 202；另有 2 场主办方社区活动，共 394 条。
- 254 条上游记录匹配到城市参考点，另有原来的 2 个活动点。剩余 138 条上游记录仍可搜索、筛选和查看详情，缺地点不填国家中心点。
- 这不是对 CCF 第七版完整覆盖的认证。CCF 级别来自第三方标注，官方权威入口是 [CCF 推荐目录](https://www.ccf.org.cn/Academic_Evaluation/By_category/)。领域按标题关键词编辑归类，不冒充 CCF 官方学科分类。
- 会议名称、截止日期、通知日期、举办日期与地点来自 [Conference Partner](https://www.myhuiban.com/conferences/ccf)。每条保留其 `detail_page` 和上游 ID；数据使用按其[开发者条款](https://www.myhuiban.com/developers)署名回链。上游代码的 MIT 许可不延伸为数据统一许可。

## 交互与时间语义

默认勾选学术会议 A、B 类，并筛选即将举办；支持全部日程、历史日程、截止日未过，以及搜索、A/B/C/社区、编辑主题、年份、地区。日期比较按用户访问当日的北京时间日历日；“截止日未过”不保证此刻仍可投稿（上游日期不含时分与时区）。详情必须引导核对原来源。

不把开始日期推断为结束日期。历史会议保留其原日期，过期快照不改写成今天。地图只绘制当前筛选下已定位记录，同城沿用聚合点；点开实体后可单独定位。城市参考坐标不是会场坐标，也不表示活动主办方已独立复核。

地图位置来自 Natural Earth 50m populated places（public domain），固定提交 `ca96624a56bd078437bca8184e78163e5039ad19`。按规范化城市名和明确国家唯一匹配，少量城市别名记录在转换过程；当前匹配结果保存于 `data/reference/conferences/locations.json`。同名歧义、国家级、线上、地区级、待更新或未覆盖城市不落点。台湾沿用中国台湾显示和 CHN 分组，原始地点字段保留用于追溯。

情报室加入一条“会议与社区活动资料库”来源记录，指向同一份数据与观测模块；未将 392 条静态目录批量伪装为新动态。逐场知识导入与真实日程变更流可后续扩展。

## Ownership and refresh

- `data/sources/ccf-conferences.json`: provider's published snapshot, no per-venue authenticated detail or CFP text scraping.
- `data/reference/conferences/provenance.json`: pinned source commit and capture day.
- `data/reference/conferences/locations.json`: reviewed city-reference matches; new or changed location strings stay unlocated until matched.
- `scripts/build-conferences.py`: deterministic adapter, exact ID/count/date/URL validation; generated `public/data/conferences.json` reuses the two existing community records.
- `src/conferences/`: validation, filters, compact browser and date details. The client fetches our static snapshot, not the provider API.
- `scripts/refresh-conferences.py`: bounded daily published-snapshot refresh, compares records before writing, retains the last good bundle and its date on errors. This uses the provider-recommended public bulk snapshot, not a detail crawl; no account or credentials. No automatic event approval or social messages.
- Pages workflow runs this refresh daily at 01:23 UTC / 09:23 Asia/Shanghai, rebuilds the intelligence collection entry and archives only validated outputs. It does not promise exact update time. Current implementation compares full public snapshots rather than calling the API's incremental endpoint.

Run `npm run conferences:build`, `npm run conferences:check`, `npm run intelligence:build`, normal checks, and `node tests/conferences-ui.mjs` against the repository-subpath preview. Browser QA covers filters, unlocated detail, source dates, map locate, light/dark, language and mobile. CI and deployment receipts live in the implementation PR; a local build is not a deployment receipt.

## 1.17.1 分类层次

会议与活动 → 学术会议 → A / B / C 类；社区活动与学术会议并列。使用原生多选框，学术会议父项支持全选/取消与部分选中状态。默认仅 A、B 类，C 类和社区活动可随时加入，允许全部取消；“清除筛选，查看全部”仍能恢复完整资料库。分类数量随时间、搜索、主题、年份和地区变化，不受自身类别勾选影响。类别选择在本次页面会话的主题/语言/模块切换中保留，刷新回到 A+B 默认。地图、列表、当前观察计数与最新活动共用筛选结果。


## 1.18.0 左侧目录树与信息卡

左侧“生态动态 → 会议与活动”可以逐级展开“学术会议 → A/B/C 类 → 具体会议”；社区活动有独立分支。打开会议面板时会展开到等级层，逐场目录默认每类 6 条，可继续展开。目录在现有可滚动侧栏内展开，地图、统计和生态脉动不改变布局。

- 箭头只展开/收起，不改变勾选；复选框支持跨类多选和学术父项部分选中。点击分类文字仅查看该分类，点击具体会议在右侧打开实体信息卡；缺坐标的会议也能查看。
- 目录与信息卡共享 `Filters`，默认 A+B 和即将举办。时间、搜索、地区等会同时影响分支数量和目录；数量包括未定位记录，不是地图点数。关闭整个会议图层保留分类偏好；重新启用空分类时恢复 A+B。
- 右侧保留多选、完整列表、日期、原始来源和定位；在任一信息卡修改筛选，同页其他卡片及左侧树同步，最新活动也随之更新。目录展开状态在本次页面会话中保留；刷新恢复默认。
- 原生按钮/复选框支持键盘，重绘恢复具有稳定 ID 的树控件焦点。手机在“图层”中展开，点击分类或会议后切至“概览”；不存在坐标时不提供地图定位。

实现入口：`src/conferences/tree.ts`、`tree.css`；类别增删通过 `model.ts` 的共享函数，两种界面不维护各自独立的勾选逻辑。来源、CCF 第三方标注限制和每日刷新机制不变。

## 1.19.0 社区活动扩充

2026-10-28 首次接入两组维护者指定来源，学术 392 条 + 去重后社区 179 条 = **571 条**。这一数字是此次快照，不是全球活动总量；未来更新以页面来源和数量为准。

| 来源 | 本次范围 | 时间与处理 |
| --- | --- | --- |
| [Open Source Deadlines](https://github.com/hust-open-atom-club/open-source-deadlines) / [浏览入口](https://oseddl.openatom.club/) | activities / competitions / conferences 三个 YAML，97 个活动届次 | 固定提交 `8f30d66ac6fb99d5064aebb7d3a1f4ed3846a3cf`（2026-10-14 更新），采集 2026-10-28；主要为 2024–2025 历史档案，少量 2026 项目，不修改年份 |
| [LF Calendar](https://events.linuxfoundation.org/about/calendar/) | 本次公开页 58 条 | 采集 2026-10-28；页面未提供统一更新时间，保留未知 |
| [LF Community](https://events.linuxfoundation.org/about/community/) | 本次公开页 23 条 | 包含第三方社区活动，不等同全部为 LF 主办或背书 |
| 原有主办方日程 | 2 条 | 一条 KubeCon North America 与 LF 同届同链接合并，保留已有 ID 与别名 |

社区子目录为 **社区大会 69 / 交流与沙龙 79 / 竞赛与黑客松 17 / 培养与招募 14**，均为 OpenDipper 编辑分类；保留原始 `sourceCategory` 和标签。左树和信息卡同步四类选择，学术 A/B 默认不变。高级筛选补充来源和参与形式。社区 135 条有城市参考点、32 条线上、12 条其他未定位（含混合形式/冲突/未覆盖城市）；未定位仍在完整列表中。地图位置补充使用同版 Natural Earth 的 17 个城市参考条目，绝不把城市点当精确会场。

详情展示原始日期、地点、时区、征稿状态及报名/征稿/开始/结束等节点。没有结束日时保留 null，不推断长期开放；日期冲突提示核对原文。`24:00` 等原文时间保留，不进行暗中时区转换。截止筛选仅使用明确标为截止的节点，按源日期与北京时间当前日比较，不能保证此刻仍能报名或投稿。“历史日程”仅指开始日在过去，不推断活动已经结束。线上活动不落地图，混合地点不足以定位时也保留未知。

### 可复现数据链路 / Reproduction

- `data/sources/community-deadlines/` 保存原始三份 YAML、MIT 原通知、提交/Git blob/SHA-256 与归一化输入。许可不延伸至链接网站的材料。
- `data/sources/linuxfoundation-events.json` 保存事实元数据、两个列表 URL/响应哈希和逐条来源。未复制宣传描述、网页 HTML、商标或视频；没有统一数据许可声明。
- `scripts/community_sources.py` 执行有限字段适配、日期解析、分类、唯一城市匹配、同 URL+日期去重。`build-conferences.py` 与原 CCF 数据合并；输出中每条社区记录保留来源页和采集时间。OSD 的 Git blob 指向固定提交，LF 的来源列表会持续变化，不能把它当永久归档原页。
- `scripts/refresh-community.py` 最多 7 次公开请求（OSD 分支、许可和三份 YAML，LF 两个列表），30 秒超时/响应大小上限，不追随每个活动详情页。解析、身份和哈希校验失败则回滚整个新快照；OSD 许可变化要求维护者复核。LF 旧届次保留为历史，更新按 sourceId+年份区分；没有自动创建事件新闻或批准标签。
- 日常 UI 开发只用快照与 Python 标准库；授权主动刷新时先 `python3 -m pip install -r scripts/requirements-community.txt`，再 `npm run refresh:community`。PyYAML 固定版本只用于读取上游 YAML。Pages 每日 01:23 UTC 在 CCF 刷新后执行社区刷新，来源无实质变化不推进采集时间。
- 情报室仍只用一条资料库摘要关联会议目录，各来源时钟独立；179 条活动未被伪装成179条新发生的动态。

复用交互与工程经验见 [INTERACTION_PATTERNS](INTERACTION_PATTERNS.md)。本次由 AI 辅助采集、分类、实现与自动验证；没有声称人工逐项确认活动仍有效或每个会址正确。CI、截图审阅和部署回执记录在实现 PR。
