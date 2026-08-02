# SemverForge

离线 SemVer 版本检查器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 语义化版本解析与严格校验
- 版本比较（含预发布 precedence 规则，build 元数据忽略）
- 范围匹配：`^` `^` 兼容、`~` 波浪、`>` `>=` `<` `<=` 比较、`x`/`*` 通配、`a - b` 连字符、`||` 或

纯函数：`parse` / `valid` / `compare` / `satisfies` / `inc` —— 见 `_test.js`。
