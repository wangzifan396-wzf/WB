# Base64Forge

Base64 / Base64URL 编解码器 —— 单文件、零依赖、本地优先。不依赖 `atob`/`btoa`（它们对非 Latin-1 会抛错），自研 UTF-8 字节层 + RFC 4648 双字母表。

- `b64Encode(text, {urlSafe, pad})` / `b64Decode(b64)`：文本级编解码，UTF-8 安全。
- `b64EncodeBytes(bytes, opts)` / `b64DecodeToBytes(b64)`：字节级 API，返回 `{value,error}`。
- 支持标准 `+/` 与 URL-safe `-_` 字母表、可选 `=` 填充、宽松解码（忽略空白与缺失填充）。

## 测试
```
node _test.js
node smoke.js
```
