# JwtForge

离线 JWT 解码器 · 单文件 · 零依赖 · 本地优先。

## 功能
- Base64URL 解码 header / payload / signature
- 过期时间（exp）、签发时间（iat）人类化显示，自动标记是否已过期
- 检测 `alg=none` 未签名风险
- 全部在浏览器本地完成，不上传、不联网

纯函数：`b64urlDecode` / `b64urlEncode` / `decode` / `humanize` / `analyze` —— 见 `_test.js`。
