# HtmlEntityForge

HTML 实体编/解码器 —— 单文件、零依赖、本地优先。用于 XSS 防护、内容转义与特殊字符嵌入。

- `encode(str, {mode})`：`mode` 支持 `named`（命名实体，如 `&lt;`）、`decimal`（`&#60;`）、`hex`（`&#x3c;`）。`& < > " '` 始终编码为命名实体。
- `decode(str)`：同时解码命名实体（`&amp;`）与数值实体（`&#60;` / `&#x3c;`）。

## 测试
```
node _test.js
node smoke.js
```
