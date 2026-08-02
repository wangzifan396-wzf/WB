# ShotForge

离线代码截图生成器（carbon / ray.so 风格的本地替代）· 单文件 · 零依赖 · 本地优先。

## 功能
- 实时语法高亮（轻量分词：关键字 / 字符串 / 注释 / 数字 / 函数名），覆盖 JS/TS/Python/Shell/CSS/JSON/HTML/SQL/Go/Rust/Java/YAML/C 等
- 仿 macOS 窗口外观（红黄绿交通灯 + 标题栏），多套暗色主题
- 一键「复制 SVG」与「下载 PNG」（2x 栅格化，纯前端、不上传代码）
- 代码始终留在本地，适合贴进 README / 幻灯片 / 博客

纯函数：`tokenizeToTokens` / `htmlFromTokens` / `svgFromTokens` / `escapeXml` —— 见 `_test.js`。
