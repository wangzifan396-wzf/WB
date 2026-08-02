# StatusForge

离线 HTTP 状态码速查 · 单文件 · 零依赖 · 本地优先。

## 功能
- 覆盖 1xx–5xx 共 60+ 状态码，含名称、含义、类别
- 按数字前缀、名称或含义关键词搜索
- 按类别筛选（信息 / 成功 / 重定向 / 客户端错误 / 服务器错误）
- 点击任意条目复制状态码

纯函数：`getStatus` / `searchStatus` / `listByCat` / `catOf` —— 见 `_test.js`。
