# PunyForge

离线 Punycode / IDN 编解码器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 标签编码/解码：Unicode 码点 <-> Punycode（RFC 3492 Bootstring 算法）
- 域名编码/解码：国际化域名（如 例子.中国）与 `xn--` 形式互转
- 全部在浏览器本地完成，不上传、不联网

纯函数：`encode` / `decode` / `encodeDomain` / `decodeDomain` —— 见 `_test.js`。
