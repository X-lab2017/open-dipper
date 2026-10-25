# 维护、清理与兼容边界

整理日期：2026-10-25。清理依据是用途和可再生性，不能仅按文件名里的“旧”或“demo”判断。

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

这些兼容路由处于维护范围，主要接受正确性、可访问性与构建修复；新产品功能优先进入 `src/observatory/`。未来退役需要独立 issue、使用评估、替代/重定向方案与测试调整。

## 生成文件的生命周期

| 维护源 | 生成命令 | 输出 |
| --- | --- | --- |
| `design/tokens.json`、共享组件 | `npm run design:build` | CSS/Canvas tokens 与 public 视觉镜像，精确列表见 `scripts/build-design.mjs` |
| `docs/CONTEXT.json` | `npm run docs:build` | 根 `llms.txt`、`public/llms.txt`、`public/agent-context.json` |
| 设计规范、资源与品牌 notice | `npm run design:package` | 忽略的 `public/design-system/open-dipper-visual-baseline-v1.zip` |
| 源代码和 public 静态资源 | `npm run build` | 忽略的 `dist/`，供部署使用 |
| 浏览器套件 | 对应 `test:*:ui` 命令 | 忽略的 `screenshots/` |

生成索引与 tokens 镜像提交入库以便直接使用；ZIP、依赖、构建目录、截图和缓存不入库。版本化数据快照由采集工作流归档，不是构建垃圾。

后续删除前先用 `rg` 查找引用、检查 Vite 入口/脚本/测试/文档链接，再确认是否可从已保留源重建。避免对工作区运行无差别 `git clean -fdx`。清理后运行相关检查并在 PR 说明删了什么、为什么可删、如何恢复。
