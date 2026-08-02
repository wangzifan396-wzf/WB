# UnicodeForge

离线 Unicode / 编码检查器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 文本 ↔ `\uXXXX` 转义（支持 `\u{...}` 与 `\xHH`）
- 文本 → 码点 `U+`（正确处理 emoji 等增补字符）
- 文本 → UTF-8 字节序列（hex）
- 文本 ↔ HTML 数字实体（`&#nn;` / `&#xHH;`）

纯函数：`toUnicodeEscape` / `fromUnicodeEscape` / `toCodePoints` / `toUtf8Bytes` / `toHtmlEntities` / `fromHtmlEntities` —— 见 `_test.js`。
