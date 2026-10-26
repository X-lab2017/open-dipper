# 维护、清理与兼容边界

整理日期：2026-10-26。清理依据是用途和可再生性，不能仅按文件名里的“旧”或“demo”判断。

## 本轮整理决定

| 内容 | 处理 | 原因 |
| --- | --- | --- |
| 早期 `docs/PROGRESS.md` | 原文移到 [历史档案](archive/2026-10-24-prototypes.md)，旧入口保留导航 | “未部署/浏览器未验收”等历史结论不能继续冒充当前状态 |
| 当前状态、历史、决策 | 分别维护 `STATUS.md`、`HISTORY.md`、`DECISIONS.md` | 新参与者可以区分事实、理由、待办 |
| 视觉规范与设计资源 | 维持 `VISUAL_SYSTEM.md` 和 `design/tokens.json` 为权威源 | 不新增第二套主题或 logo 规则 |
| `dist/`、Python 缓存、生成 ZIP | 验证后清理本地生成产物；保持 Git 忽略 | 下次构建可以重建，源码不需要这些中间物 |
| `node_modules/`、开发环境状态 | 保留 | 不是此次源码清理目标，不扰乱正在使用的环境 |
| 工作区外的验收图与用户上传附件 | 保留 | 属于评审证据或用户输入，不属于可任意删除的仓库缓存 |

## 必须保留的兼容内容

- `analysis.html` → `src/main.ts` / `src/style.css`：详细分析工作台，有数据、DOM 和浏览器验收。
- `panorama.html` → `src/panorama.ts` / `src/panorama.css` / `src/globe-math.ts`：历史全景入口，仍在构建和测试中。
- `src/observatory/globe-math.ts`：新版相机/地图数学。与旧全景模块职责不同，不能因同名直接合并删除。
- `public/data/demo.json`：固定模拟 fixture，是产品明确支持的模式。不是临时随机样本。
- `public/brand/`：官方六个 SVG、来源 SHA 和 notices；不同主题、favicon、资源展示仍使用这些变体。
- `archive/pre-observatory-v1-20261025` 分支：历史参考；本轮没有删除或改写该分支。

这些兼容路由处于维护范围，主要接受正确性、可访问性与构建修复；新产品功能优先进入 `src/atlas.ts`、`src/radar/` 与共享领域模块。未来退役需要独立 issue、使用评估、替代/重定向方案与测试调整。

## 生成文件的生命周期

| 维护源 | 生成命令 | 输出 |
| --- | --- | --- |
| `design/tokens.json`、共享组件 | `npm run design:build` | CSS/Canvas tokens 与 public 视觉镜像，精确列表见 `scripts/build-design.mjs` |
| `docs/CONTEXT.json` | `npm run docs:build` | 根 `llms.txt`、`public/llms.txt`、`public/agent-context.json` |
| 设计规范、资源与品牌 notice | `npm run design:package` | 忽略的 `public/design-system/open-dipper-visual-baseline-v1.zip` |
| 源代码和 public 静态资源 | `npm run build` | 忽略的 `dist/`，供部署使用 |
| 浏览器套件 | 对应 `test:*:ui` 命令 | 忽略的 `screenshots/` |

生成索引与 tokens 镜像提交入库以便直接使用；ZIP、依赖、构建目录、自动生成的 QA 截图和缓存不入库。维护者明确选取的产品展示与历史截图保存在 `docs/assets/`，由 [视觉演进图档](archive/2026-10-25-visual-evolution.md) 记录来源并提交入库；这些是文档资产，不属于可再生缓存。版本化数据快照由采集工作流归档，不是构建垃圾。

后续删除前先用 `rg` 查找引用、检查 Vite 入口/脚本/测试/文档链接，再确认是否可从已保留源重建。避免对工作区运行无差别 `git clean -fdx`。清理后运行相关检查并在 PR 说明删了什么、为什么可删、如何恢复。


## 2026-10-26 · 社区与上下文清理

本轮 [#30](https://github.com/X-lab2017/open-dipper/issues/30) 按“当前契约、历史理由、已被替代的草稿”整理，未删除兼容代码、固定数据、品牌原件或评审截图。

| 内容 | 处理与理由 |
| --- | --- |
| 两份完整观测/雷达提案 | 移入 `docs/archive/`；原路径保留简短导航，避免旧链接失效或旧方案冒充当前实现 |
| 当前状态、首页、架构和开发路径 | 删除重复的历史状态段落，改为当前产品与契约；历史交付由 `HISTORY.md` 和完成计划承接 |
| Agent 任务索引 | 移除仅设计草稿的编辑任务；一般 UI 指向 `src/atlas.ts`，雷达指向 `src/radar/`；旧 workspace 仅用于仍在使用的数据适配 |
| 下列 6 个草稿文件 | 已检索运行时代码、构建、测试和文档引用；无运行时消费者，被正式实现与截图替代，从当前树删除 |

- [`docs/design/observation-model.ts`](https://github.com/X-lab2017/open-dipper/blob/391112efc97726fdda3c5aaa86115051c65440e9/docs/design/observation-model.ts)
- [`docs/design/observation-catalog.ts`](https://github.com/X-lab2017/open-dipper/blob/391112efc97726fdda3c5aaa86115051c65440e9/docs/design/observation-catalog.ts)
- [`docs/design/observation-layers-v1.svg`](https://github.com/X-lab2017/open-dipper/blob/391112efc97726fdda3c5aaa86115051c65440e9/docs/design/observation-layers-v1.svg)
- [`docs/design/ai-radar-dark.svg`](https://github.com/X-lab2017/open-dipper/blob/391112efc97726fdda3c5aaa86115051c65440e9/docs/design/ai-radar-dark.svg)
- [`docs/design/ai-radar-light.svg`](https://github.com/X-lab2017/open-dipper/blob/391112efc97726fdda3c5aaa86115051c65440e9/docs/design/ai-radar-light.svg)
- [`docs/design/ai-radar-models.svg`](https://github.com/X-lab2017/open-dipper/blob/391112efc97726fdda3c5aaa86115051c65440e9/docs/design/ai-radar-models.svg)

这些链接固定到清理前提交 `391112efc97726fdda3c5aaa86115051c65440e9`。如需单独恢复，用 `git show <该提交>:<文件路径>` 导出；不要把整个 main 回退。原计划中的设计验证是历史记录，不要求后续贡献者继续检查已删除的参考类型。完整旧状态可在该提交查看；当前默认读取路径不包含这些草稿。

本轮未改写 [Atlas 1.3.0](../design/baselines/atlas-1.3.0.md) 的历史指纹。新 [1.3.2 基线](../design/baselines/observatory-radar-1.3.2.md) 独立固定地图与雷达；资源包使用新基线并附原 Atlas 记录。

## 2026-10-26 · 星系发布收尾

以公开主分支 `3d89ddf5cf59f5c700a058f91ade413f6284dae8` 为整理起点；[PR #33](https://github.com/X-lab2017/open-dipper/pull/33) 已合并，[生产 CI / Pages](https://github.com/X-lab2017/open-dipper/actions/runs/40328984137) 已成功。

| 内容 | 处理与理由 |
| --- | --- |
| 星系公开发布计划 | 改为完成回执，补齐最终 PR、提交、CI 和部署时间；删除已失效的恢复／合并步骤，保留失败教训、报告哈希和截图 |
| 旧图层／雷达设计状态 | 更正残留的 active、待评审和待部署表述，指向已完成交付与当前契约 |
| 星系 1.4.0 / 1.5.0 评审计划 | 删除私有托管 URL／内部定位标识和重复未来任务表，保留源提交、归档指纹、实际检查与历史截图 |
| 当前雷达契约 | 移除重复的旧版评审图文；旧截图及其验收留在各自完成计划中 |
| 当前入口与机器索引 | 区分发布应用 1.5.1 与地图／雷达固定基线 1.3.2，补齐星系架构和评审路径，重新生成三个索引镜像 |

未删除整份历史记录或图件：当前 `docs/assets/` 图片均有引用。旧路径的简短导航继续保留。三个模块的 README 展示、现有来源数据、品牌原件、兼容路由、固定基线和运行代码不受本次整理影响。开放的社区 PR 和未完成 Issue 不因发布收尾而关闭。

被精简的正文可按路径从 [整理前提交](https://github.com/X-lab2017/open-dipper/tree/3d89ddf5cf59f5c700a058f91ade413f6284dae8) 恢复，使用 `git show 3d89ddf5cf59f5c700a058f91ade413f6284dae8:<path>`；无需回退整个主分支。检查结果与本次合入证据由收尾 PR 承接。
