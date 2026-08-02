# HexForge

离线十六进制查看器（类 `xxd`）· 单文件 · 零依赖 · 本地优先。

## 功能
- 文本(UTF-8) / 十六进制 两种输入，输出经典 `偏移  十六进制…  |ASCII|` 格式
- 支持从本地文件载入（FileReader，文件不离开本机）
- 可切换 16 字节行宽；一键复制 dump

纯函数：`utf8Bytes` / `hexToBytes` / `hexdump` / `inputToBytes` —— 见 `_test.js`。
