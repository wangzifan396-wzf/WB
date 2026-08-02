# Base85Forge

Ascii85 / Z85 编解码器 —— 单文件、零依赖、本地优先。比 Base64 省约 7%（4 字节 → 5 字符），补齐矩阵内 Base32/58/64 编码家族的最后一块。

- `b85Encode/Decode`：Adobe Ascii85（PDF/PostScript 同款），`<~ ~>` 包裹、全零组 `z` 压缩、尾组按 84 填充规则截断。
- `z85Encode/Decode`：ZeroMQ Z85（RFC 32），字符集对 JSON/源码友好，严格 4 字节对齐校验；规格向量 `864FD26F B559F75B → HelloWorld` 实测通过。
- 内置 UTF-8 字符串 ↔ 字节互转，中文照编不误。
- 非法字符 / 组溢出 / 尾组长度 1 全部返回 `{error}` 定位到字符位置。

## 测试
```
node _test.js
node smoke.js
```
