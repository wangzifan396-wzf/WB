# HmacForge

HMAC-SHA256 签名器 —— 单文件、零依赖、本地优先。自研 SHA-256 + 标准 HMAC 构造（ipad/opad），通过 RFC 4231 官方测试向量（TC1/TC2/TC3/TC6 含超长密钥分支），理解 API 签名 / Webhook 校验 / JWT HS256 的密码学内核。

- `hmacSha256(keyBytes, msgBytes)`：密钥 >64 字节先哈希，短则补零；返回 64 位 hex。
- `hmacSha256Text(key, msg)`：UTF-8 文本便捷入口。
- `timingSafeEqual(a, b)`：恒时比较，防时序侧信道攻击。
- `hexToBytes(hex)`：奇数长度抛 `HEX_ODD_LENGTH`，非法字符抛 `HEX_INVALID`。

## 测试
```
node _test.js
node smoke.js
```
