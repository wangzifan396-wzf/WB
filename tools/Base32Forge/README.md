# Base32Forge

Base32 四变体编解码器 —— 单文件、零依赖、本地优先。TOTP 密钥、Crockford 短 ID、z-base-32 都在用的编码家族，一个页面全搞定。

- **RFC 4648**（`A-Z2-7` + `=` padding）：TOTP/HOTP 密钥标准格式。
- **Base32Hex**（RFC 4648 §7，`0-9A-V`）：保序变体。
- **Crockford**（无 `ILOU`）：解码容错 `i/l→1`、`o→0`，忽略连字符，大小写不敏感。
- **z-base-32**（小写人性化字母表）：无 padding。
- 输入按 UTF-8 编码，解码按 UTF-8 还原；非法字符返回 `{error}` 不抛异常。

## 测试
```
node _test.js
node smoke.js
```
