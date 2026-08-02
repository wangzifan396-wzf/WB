# CrcForge

CRC 校验和计算器 —— 单文件、零依赖、本地优先。实现 CRC-32（IEEE 802.3，多项式 0xEDB88320）与 CRC-16/CCITT（多项式 0x1021），用于数据完整性校验、网络包与存储可靠性（zlib / PNG / Ethernet 底层即用 CRC）。

- `crc32(str)` → 无符号 32 位整数（`>>>0`）。
- `crc16ccitt(str)` → 16 位校验和（初始 0xFFFF）。
- 含标准测试向量：`crc32("123456789") == 0xCBF43926`、`crc16ccitt("123456789") == 0x29B1`。

## 测试
```
node _test.js
node smoke.js
```
