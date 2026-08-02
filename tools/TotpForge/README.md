# TotpForge

离线 TOTP 身份验证器（RFC 4226 HOTP / RFC 6238 TOTP）· 单文件 · 零依赖 · 本地优先。

## 功能
- 纯 JS 实现 HMAC-SHA1（无外部依赖），已用 **RFC 4226 / RFC 6238 官方测试向量** 验证
- 支持 Base32 或 ASCII 密钥、6/8 位、自定义周期（默认 30s）
- 实时倒计时进度条；密钥默认隐藏，可一键显示
- 全部计算在本机完成，密钥与验证码绝不离开浏览器

纯函数：`sha1bytes` / `hmacSha1` / `hotp` / `totp` / `base32Decode` / `secretToBytes` —— 见 `_test.js`（含官方向量）。
