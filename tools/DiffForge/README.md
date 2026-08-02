# DiffForge

离线文本差异对比工具 · 单文件 · 零依赖 · 本地优先。

## 功能
- 基于 LCS 的行级 diff（增 / 删 / 同），并统计 `+新增 / -删除 / =相同`
- 并排视图与统一视图（Unified）两种展示
- 内置逐字符 inline diff（LCS），定位行内改动

纯函数：`diffLines` / `inlineDiff` / `diffStats` / `unifiedText` —— 见 `_test.js`。
