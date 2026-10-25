# 采集、部署与故障处理

实际调度与权限以 [pages.yml](../.github/workflows/pages.yml) 为准。站点是静态快照产品，没有在线写入 API、数据库或浏览器端 GitHub 凭据。

## 调度与发布链

| 触发 | 采集 | 检查 | 发布 |
| --- | --- | --- | --- |
| PR 到 main | 不访问上游采集，不归档 | 类型、确定性测试、构建、三套 Chromium | 不部署 |
| push main / 手动运行 | 事件；手动勾选 `refresh_monthly` 时另刷月度与地域 | 同上 | 验证快照后正常 Git push，再 Pages |
| 每小时 17、47 分（UTC） | 事件 | 类型、确定性测试、构建 | 同上，不跑浏览器 |
| 每月 8 日 02:07（UTC） | 事件 + 月度指标 + 地域 | 同上 | 同上，不跑浏览器 |

采集周期是目标。Actions 排队、上游更新、构建和缓存都会增加延迟；前端每五分钟查看的是已部署快照，不是直接访问来源。动态健康状态应看 `events.json.sources` 的 lastAttempt / lastSuccess / status 与页面来源面板。

构建 job 允许 contents write（归档四个快照）和 issues read（编辑审核）；部署 job 使用 pages write 与 id-token write。`GITHUB_TOKEN` 仅在 Actions 内注入，并只发送至固定 GitHub API origin。PR 路径不执行采集或快照写入。定时机器人提交不再触发自身工作流。

## 主动刷新

```sh
npm run refresh:events
npm run refresh:monthly
python3 scripts/fetch-geography.py
```

这些命令会联网并修改版本化数据。来源在 `config/sources.json`，仓库目录在 `config/repositories.json`。开发与测试优先使用已有快照。`refresh:data` 是底层采集命令，会写入当前观察到的失败；日常月度刷新应使用带 last-good 处理的 `refresh:monthly`。

事件采集：每仓库最多 10 条 release、每 RSS 响应最多 40 条，4 MB 响应和 20 秒请求限制，90 天窗口、总计 2,000 条上限。人工 issue 当前请求上限为 100，超出需增加分页后才能声称完整。这些界限是容量边界，不是全球覆盖保证。

## 人工事件发布与撤回

1. 通过站点编辑器生成本地草稿/JSON，或使用生态事件 issue 表单。浏览器只准备链接，提交由用户在 GitHub 完成。
2. 有权限的维护者核对原始来源、时间、分类、位置；无可靠地点保持 `location: null`。
3. 审核后设置 `event-approved`（首次使用可由维护者创建）。issue 最新更新时间不能晚于审核标签时间；后续编辑或评论后需移除并重新添加标签。
4. 下次成功采集发布。关闭 issue 或移除标签后，下次成功协调撤回；采集故障期间保留的历史事件可能暂未反映撤回，来源标为过期。

普通开发、Agent 任务、历史记录 issue 不加此标签。不要让提交者自动审核自己的事件，也不要用修改测试的方式绕过标签历史检查。契约见 [EVENTS.md](EVENTS.md)。

## 常见故障

| 现象 | 核查与处理 |
| --- | --- |
| 事件显得很旧 | 先看来源 lastSuccess、Actions 最近运行和原始发布时间；不是改 generatedAt 来变“新” |
| RSS/GitHub 出错 | 检查配置、响应限制、上游变化和 Actions 日志；旧记录保留并披露 stale/error |
| 手工事件未发布 | 核查 issue 是否开放、标签、JSON、时区、审核时间与最近评论；修正后重新审核 |
| 月度某指标缺失 | 查看该序列 status/latestMonth/reason；HTTP 404 不等于零或项目不存在 |
| 地域刷新失败 | 工作流恢复刷新前的 geography/geometry；本地运行需先保留旧文件，再审查 diff |
| 快照 push 被拒绝 | 可能有并发写入。读取最新 main 并重跑/合并合法变更；不 force-push 覆盖机器人或他人提交 |
| 构建成功但网页仍旧 | 检查 deploy job、Pages 环境和缓存；只有 build 成功不代表部署完成 |

## 回滚

通过新提交 revert 有问题的代码改动并走相同检查/发布链；不要 reset/force-push main。数据问题先定位来源或适配器，必要时将已验证快照恢复为新提交并阻止同一错误再次被采集覆盖。记录影响范围、数据时间、最后正常运行和恢复提交。回滚视觉时同时还原 tokens 及生成镜像；回滚契约时检查前后端兼容。

浏览器截图作为 Actions artifacts 保留七天；源快照在 Git 中保留历史。安全问题与权利问题见 [SECURITY.md](../SECURITY.md) 和 [RIGHTS.md](RIGHTS.md)。
