# ULIDForge

离线 ULID 工具 · 单文件 · 零依赖 · 本地优先。

## 功能
- 生成时间有序、字典序可排序的唯一 ID（26 位 Crockford Base32）
- 解码 ULID 为时间戳（ms）/ 日期 / 80 位随机数（hex）
- 严格校验 Crockford Base32（无 I/L/O/U）

纯函数：`encodeTime` / `encodeRandom` / `generate` / `decode` / `isValid` —— 见 `_test.js`。
