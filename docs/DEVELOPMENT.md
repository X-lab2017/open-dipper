# 开发与验证指南

环境使用 Node.js 24（与 CI 一致）、npm、Python 3；浏览器验收使用 Chromium。`npm ci` 安装锁定依赖，`npm run dev` 启动开发服务。所有命令从仓库根目录执行。环境或网络限制导致未运行的检查，必须写明，不可记为通过。

## 按任务读取与修改

| 任务 | 先读 | 主要修改位置 | 有针对性的检查 |
| --- | --- | --- | --- |
| 布局、筛选、语言与编辑器 | [视觉规范](VISUAL_SYSTEM.md)、[架构](ARCHITECTURE.md) | `src/atlas.ts`、`atlas.css`、`presentation-v*.css` | `typecheck`、`test:observatory`、`test:observatory:ui` |
| 情报关注、样刊与共建 | [情报契约](INTELLIGENCE.md)、[架构](ARCHITECTURE.md) | `intelligence.ts`、`portal.ts`、`portal.css`、独立演示 JSON | `typecheck`、`test:observatory`、`test:portal:ui` |
| AI 雷达候选与交互 | [实现契约](AI_RADAR.md)、[已批准提案](design/AI_RADAR_PROPOSAL.md) | `src/radar/`、`scripts/build-radar.mjs`、`data/reference/radar/` | `radar:build`、`radar:check`、`typecheck`、`test:portal:ui` |
| 地图/地球/相机 | [视觉规范](VISUAL_SYSTEM.md)、[地域契约](../public/data/GEOGRAPHY.md) | `src/observatory/scene.ts`、`globe-math.ts` | `test:observatory`、`test:observatory:ui`；检查日期变更线与极区 |
| 共享视觉资源 | [设计资源](../design/README.md) | `design/tokens.json`、`src/design/` | `design:build`、`design:check`、`build`；深浅主题浏览器检查 |
| 月度数据 | [月度契约](../public/data/README.md) | `config/repositories.json`、`scripts/fetch-data.mjs`、`refresh-monthly.mjs` | `test:data`、`test:dom`、`test:observatory` |
| 全球分布 / AI 供给 | [数据证据契约](DATA_EVIDENCE.md) | `data/reference/`、`build-evidence.mjs`、`evidence.ts`、`evidence-view.ts` | `evidence:build`、`evidence:check`、`typecheck`、`test:portal:ui` |
| 观测实体与图层设计（提案） | [图层 RFC](OBSERVATION_LAYERS.md)、[参考类型](design/README.md) | `docs/design/`；尚未接入运行时 | 参考类型独立 TypeScript 检查、`docs:build`、`docs:check`；实现界面后补 UI 检查 |
| 地域数据 | [地域契约](../public/data/GEOGRAPHY.md) | `scripts/fetch-geography.py`、`src/observatory/model.ts` | `test:geo`、`test:observatory` |
| 事件来源、审核 | [事件契约](EVENTS.md)、[运维](OPERATIONS.md) | `config/sources.json`、`scripts/collect-events.py`、`model.ts` | `test:observatory`（含 Python 采集器测试） |
| 分析/历史全景兼容 | [维护边界](MAINTENANCE.md) | `src/main.ts`、`src/panorama.ts`、`src/globe-math.ts` | `test:dom`、`test:panorama` 与对应浏览器套件 |
| 文档、Agent 上下文 | [文档导航](README.md)、[AGENTS](../AGENTS.md) | 相关权威文档、`docs/CONTEXT.json` | `docs:build`、`docs:check`；影响构建时运行 `build` |
| CI/部署 | [运维](OPERATIONS.md) | `.github/workflows/pages.yml` | 确定性检查、构建、实际 Actions/Pages 结果 |

表中为 `npm run` 后的脚本名。完整合入检查如下；`npm test` 包含数据、DOM、地域、历史全景、观测站/相机、Python 采集器、视觉与文档检查。

需求到工程验收的过程见 [HARNESS.md](HARNESS.md)。复杂或跨会话任务保留 [执行计划](plans/README.md)；README 与贡献指南中英文同步，两个结构图的节点/连线对应关系也纳入文档检查，翻译内容由贡献者复核。

```sh
npm run typecheck
npm test
npm run build
```

不要为了文档或样式改动访问上游刷新数据。主动采集会改变版本化快照，见 [运维](OPERATIONS.md)。

## 浏览器验收复现

CI 在 `/open-dipper/` 子路径验收，避免只在站点根目录可用。下面是本地两终端复现；若使用的受管开发环境指定了预览服务，应使用该环境的服务入口，不额外启动服务器。

终端 A：

```sh
npm run build
npx playwright install --with-deps chromium
OD_QA_ROOT=$(mktemp -d)
mkdir -p "$OD_QA_ROOT/open-dipper"
cp -R dist/. "$OD_QA_ROOT/open-dipper/"
python3 -m http.server 4173 --bind 127.0.0.1 --directory "$OD_QA_ROOT"
```

终端 B（仓库根目录）：

```sh
npm run test:observatory:ui
npm run test:portal:ui
npm run test:panorama:ui
BASE_URL=http://127.0.0.1:4173/open-dipper/analysis.html npm run test:ui
```

检查结束后在终端 A 按 Ctrl-C 停止服务，再移除此次创建的临时目录。观测站 URL 可用 `BASE_URL` 覆盖；全景用 `PANORAMA_URL`；分析页用 `BASE_URL`。测试生成 `screenshots/`，CI 保存七天，截图不进入源码。

浏览器通过并不证明所有视觉问题都不存在。变更布局时还需按 [评审路线](REVIEW.md) 看一屏/两屏、移动端、长标题、空状态、主题和键盘焦点。CI 非定时构建执行四套 Chromium 验收，定时采集只运行确定性检查与构建。

## 新增数据适配器的最小流程

明确范围、指标定义、观察期、来源版本与失败语义 → 在对应配置和适配器实现 → 添加缺失、非法值、失败保留、重复/撤回等有意义的测试 → 使用可审查样例验证 → 更新契约和来源说明。无需为了测试重复实现生产逻辑，也不要把未经核验的来源输出塞入正式快照。

## 完成与交接

检查 `git diff --check` 和最终 diff；确认没有凭据、意外数据刷新或生成缓存。提交说明描述最终行为，关联 issue。若还有缺口，记录复现方法、具体文件、最近通过检查和下一步，使用 [HANDOFF.md](templates/HANDOFF.md)。

## Observation workspace (legacy contracts)

Read [ATLAS_WORKSPACE.md](ATLAS_WORKSPACE.md) for the current atlas runtime. [OBSERVATION_WORKSPACE.md](OBSERVATION_WORKSPACE.md) documents the previous workspace and still-used evidence inputs. Run `npm run observation:build` after editing pinned references and `npm run observation:check` to validate. `tests/workspace-ui.mjs` is included in `test:observatory:ui` and covers presets, missing sources, China scope and refresh recovery.

Atlas regression tests: `npm run test:atlas`. Camera, area/bubble/point composition, original ranking scope, paired themes and simulation boundaries are tested independently.
