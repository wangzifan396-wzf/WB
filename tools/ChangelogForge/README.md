# ChangelogForge

离线 Conventional Commits 解析器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 解析 Conventional Commits（feat/fix/... 含 scope 与 `!` 破坏性标记、BREAKING CHANGE 正文）
- 自动推断版本升级：破坏性 -> major，含 feat -> minor，仅 fix -> patch
- 生成分组变更日志（Features / Bug Fixes / ...）

纯函数：`parse` / `bump` / `nextVersion` / `changelog` —— 见 `_test.js`。
