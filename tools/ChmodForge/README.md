# ChmodForge

离线 UNIX 权限计算器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 八进制 ↔ 符号权限双向转换（如 `755` ↔ `rwxr-xr-x`）
- 支持特殊位：setuid(4) / setgid(2) / sticky(1)（如 `4755` → `rwsr-xr-x`）
- 生成 `chmod` 命令与中文权限说明

纯函数：`octalToSymbolic` / `symbolicToOctal` / `parsePerms` / `describe` —— 见 `_test.js`。
