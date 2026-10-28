# 来源、品牌与许可状态

核对日期：2026-10-26。本页记录仓库中可见的声明和待办，不为第三方材料授予额外权利。

| 范围 | 当前记录 | 维护要求 |
| --- | --- | --- |
| OpenDipper 应用源码与原创文档 | 目前没有根目录 LICENSE，尚未选择统一应用许可 | 由维护者确认权利与许可，再添加准确文本；不能因公开仓库或项目目标就宣称已有 MIT/Apache 授权 |
| OpenDipper 产品标志 | 用户批准概念的 AI 辅助矢量化与重新排字；独立品牌资产 | 保留[规范与来源](../public/brand/opendipper/README.md)，不据此授予商标背书或新增统一许可 |
| X-lab AI 官方标志 | 固定上游 SHA、原始 SVG、品牌 notice | 保留 [NOTICE](../public/brand/NOTICE.md)、[上游声明](../public/brand/UPSTREAM_NOTICE.md)、[provenance](../public/brand/provenance.json)；本仓库不追加品牌授权 |
| OpenDigger 指标和地理结果 | 原 URL、时间、原始响应哈希与范围说明 | 代码许可不等于所有源平台数据/结果的再分发许可；见 [月度数据说明](../public/data/README.md) |
| OpenShare 全球统计 | 原值、来源 URL、完整响应哈希和摘录文件哈希 | 保留来源；不追加统一数据许可，见 [证据契约](DATA_EVIDENCE.md) |
| GOSD / OpenGauge 报告摘录 | 报告仓库 CC BY 4.0；固定 commit / Git blob SHA，原来源指纹 | 署名 X-lab2017 / GOSD / OpenGauge，注明 OpenDipper 摘录与重绘，不延伸为所有 HF 资源的许可 |
| Natural Earth 几何 | Public domain 的来源说明及固定来源版本 | 保留 [地域说明](../public/data/GEOGRAPHY.md) 和 attribution |
| 运行依赖 | d3、Vite helper 等 notices | 保留 [THIRD_PARTY_NOTICES.txt](../public/THIRD_PARTY_NOTICES.txt)；依赖变化时复核 |
| 参考产品 | world-monitor.com、koala73/worldmonitor | 独立实现的设计参考；没有引入其应用源码。新增代码/素材时另行核对来源和许可 |

维护者待决策项在 [当前状态的 issue 索引](STATUS.md)。在解决前，README 披露“许可待确认”，不能把本轮 AI-friendly 整理表述为已完成全部开源许可手续。对外复用视觉包时，应用代码、数据、图形依赖与官方商标边界仍然分别适用。

## AI 雷达来源增补（2026-10-26）

`data/reference/radar/source-extract.json` 仅保留少量实体标识、事实指标、来源日期与指纹。用途描述为 AI 辅助整理，采用建议在独立演示文件中。Agentic AI Landscape 的固定提交未找到全仓 LICENSE，不推定整库再分发许可；未复制其长篇说明、应用源码或图件。GOSD 统计摘录署名 X-lab2017 / GOSD / OpenGauge；HF 官方 API 的许可字段是上游元数据，不授予额外权利。扩大数据再分发前继续在许可任务中核对。Thoughtworks 与 Zalando 仅为产品形态参考，本雷达的 SVG/CSS/交互独立实现。

## 开源星系来源增补（2026-10-26）

维护者指定使用 `YaoYao-Pig/OG-And-HG-2026` 的图数据。本次固定提交 `7f69f2fbd27860f1f207be197dfe0597216d7b0d`，保留节点身份、坐标、关系和原始快照时间，新增紧凑格式与指纹验证；未复制其应用源码。该提交未发现根 LICENSE，不把公开可访问视作统一再分发授权。原始数据平台、模型和项目各自的权利边界仍适用，扩大再分发前由维护者继续核对。来源、转换与限制见 [数据说明](../public/data/galaxy/README.md)；独立实现和交互契约见 [OPEN_GALAXY](OPEN_GALAXY.md)。

## Conference library · 2026-10-28

Conference Partner 公开快照接入：保留 ID/原日期/来源，CCF 等级为第三方标注；Natural Earth 城市参考点单独匹配，未定位记录不丢弃。署名回链、更新与失败保留规则见 [会议契约](CONFERENCES.md)。

## Community event sources · 2026-10-28

Open Source Deadlines 三份 YAML 取自固定提交，保留华中科技大学开放原子开源俱乐部的 [MIT 原通知](../data/sources/community-deadlines/LICENSE.txt)，同文随发布包提供于 `public/THIRD_PARTY_NOTICES.txt`。归一化、编辑分类与城市匹配由本项目添加，许可不覆盖链接网站内容。LF 两个公开列表仅摘录事实名称、日程、地点、链接、CFP 状态与来源哈希；不复制文章、页面、商标或宣传材料，不推定存在统一数据许可或主办背书。应用根许可状态未变。
