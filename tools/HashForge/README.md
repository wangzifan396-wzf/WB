# HashForge

哈希摘要校验器 —— 单文件、零依赖、本地优先。纯 JavaScript 实现 SHA-256 / SHA-1 / MD5，用于文件与数据完整性校验（软件供应链安全）。

- `sha256(str)` / `sha1(str)` / `md5(str)`：返回小写十六进制摘要。
- `digest(type, str)`：`type` 为 `sha256` / `sha1` / `md5`。
- 输入按 UTF-8 编码，无需浏览器 `crypto` 或任何依赖。

## 测试
```
node _test.js
node smoke.js
```
