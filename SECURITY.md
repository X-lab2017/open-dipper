# 安全问题 / Security reports

本仓库包含静态前端、采集脚本与 GitHub Actions。请特别关注文本/链接渲染、来源请求、事件审核绕过和凭据暴露。

若问题包含可利用细节或敏感信息，请优先使用仓库 Security 页的 **Report a vulnerability**（若维护者已启用）。若未启用，可提交不含漏洞细节和敏感数据的 issue，请维护者提供私密报告渠道；不要在公开 issue 上传 token、个人数据或可直接利用的载荷。本仓库不承诺尚未建立的响应时限或安全邮箱。

报告应包含受影响提交/版本、复现条件、预期与实际行为、影响范围及可安全分享的证据。普通布局或数据解释问题使用 bug 模板。贡献者不得为了排查而提交凭据；使用 Actions 提供的最小权限环境并核对最终 diff。

Public reports should omit secrets and exploit details. Use GitHub private vulnerability reporting when available; otherwise request a private contact without disclosing the vulnerability. See [operations](docs/OPERATIONS.md) for deployment and rollback behavior.
