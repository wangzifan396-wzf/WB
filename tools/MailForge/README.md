# MailForge

邮箱地址校验 / 解析 / 角色识别 —— 单文件、零依赖、本地优先。

- `validate(email)`：语法校验（本地/域名字符集、长度、TLD），返回结构化结果。
- `parse(email)`：拆出本地名、域名、TLD，并识别 `+` 标签（plus addressing）。
- `role(email)`：识别角色邮箱（admin/info/support/no-reply 等）。

## 测试
```
node _test.js
node smoke.js
```
