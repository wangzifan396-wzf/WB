# SlugForge

离线 URL Slug 生成器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 变音符折叠（é→e、ö→o、ñ→n）+ 特殊字母映射（ß→ss、æ→ae、ø→o）
- 可选分隔符（- / _ / 无）、大小写、最大长度截断
- 批量模式（每行一条）

## 纯函数
`slugify` / `deburr` / `slugifyLines` —— 见 `_test.js`。
