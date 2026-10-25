# 数据契约索引

本页解释各类数据如何拼合；字段细节由链接文档维护。TypeScript 的 [model.ts](../src/observatory/model.ts) 是浏览器使用的子集类型，不是所有原始导出字段的完整 JSON Schema。不要把编译通过当作所有上游输入都已验证。

| 文件 | 语义与时钟 | 规范 / 生产者 | 失败与约束 |
| --- | --- | --- | --- |
| `public/data/snapshot.json` | 各仓库各指标的月度观察值 | [月度契约](../public/data/README.md)；`fetch-data.mjs` / `refresh-monthly.mjs` | 缺失不补零；维护 last-good；同平台/指标/月比较 |
| `public/data/geography.json` | 标签近一年地域聚合，独立于月度轴 | [地域契约](../public/data/GEOGRAPHY.md)；`fetch-geography.py` | 未知精确起止/分母保留 null；标签可能重叠；不推断流向 |
| `public/data/countries.geojson` | 制图几何与锚点 | [地域契约](../public/data/GEOGRAPHY.md) | 不是人的位置、仓库总部或贡献量；保留来源标识 |
| `public/data/events.json` | 来源发布时间与首次采集时间 | [事件契约](EVENTS.md)；`collect-events.py` | 去重、保留窗口、来源健康、审核撤回；未定位事件仍留在快讯 |
| `public/data/intelligence-demo.json` | 8 个固定双语情报案例，独立样例日期 | [情报契约](INTELLIGENCE.md)；`intelligence.ts` | 全文件验证、缺失可降级；不注入真实流；地图适配仍标 demo |
| `public/data/demo.json` | 固定日期的虚构场景与模拟地域指标 | `scripts/generate-demo.py` | 不加入定时采集；不代替失败的真实来源；随时间筛选自然过期 |

## 需要持续保护的语义

- `0` 是有观察的零，缺失是没有观察，两者不能合并。环比基期为零或缺失时，不造出百分比。
- `latestMonth` 描述该指标实际观察终点；`fetchedAt`、`metaUpdatedAt` 描述取数/元数据时间，不能据此声称生态活跃度更新了。
- 年度地域与未来月度地域不是同一个层；新增全域数据要给出覆盖分母、未知地域、实体去重规则和可比较范围。
- OpenRank、Activity、接受的 change requests 分别表达不同测量；贡献量代理不能重命名成通用“贡献度评分”。
- 自动采集、人工审核、模拟数据分别标识。`source-published` 不等于维护者核实；严重性与 RSS 主题分类也不同。
- 来源证据包括原 URL、取数时间、状态；月度/地域哈希指向成功原始响应，不是裁剪后界面 JSON 的哈希。

## 客户端失效行为

当前初始加载要求月度快照、地域和几何可用；其中任何必需文件请求失败会进入加载错误路径。事件请求失败允许主界面继续并标记 feed 错误；模拟文件缺失不会生成替代事件。事件记录经过浏览器子集验证后才呈现，采集器承担更严格的输入检查。页面不会在真实来源失败时自动切为演示数据。

初始请求成功但 JSON 结构被破坏仍可能产生运行错误，因此 CI 的契约与快照完整性检查不可跳过。新增或破坏性修改字段时同步更新生产者、消费者、fixtures 和测试，并在 issue 说明迁移方式。

## 数据演进边界

全域数据、自动地理解析、质量评分都是后续任务，见 [当前状态](STATUS.md)。不要为了“地图更满”把未知位置猜成总部，也不要把已有国家合计转换为协作连线。来源、代码与品牌的权利分别记录于 [RIGHTS.md](RIGHTS.md)。
