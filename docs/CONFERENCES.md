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
