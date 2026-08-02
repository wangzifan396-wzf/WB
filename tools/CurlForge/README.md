# CurlForge

离线 curl 命令生成器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 可视化配置 method / headers / body / Basic 认证 / 常用开关（-i -L -s -k）
- JSON / 表单请求体自动补 `Content-Type`（已有则不重复）
- shell 单引号安全转义，多行 `\` 续行格式，粘贴即用

纯函数：`shq` / `parseHeaders` / `buildCurl` —— 见 `_test.js`。
