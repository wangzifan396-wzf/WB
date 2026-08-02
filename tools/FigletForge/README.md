# FigletForge

文本 → ASCII 方块艺术字 —— 单文件、零依赖、本地优先。

- 内置 5 行方块字体，支持 `A-Z 0-9` 与 `- . ! ? : 空格`，自动转大写。
- `render(text, {fill, gap})`：纯函数，返回多行字符串；可自定义填充字符。

## 测试
```
node _test.js
node smoke.js
```
