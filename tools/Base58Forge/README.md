# Base58Forge

Base58 编解码器 —— 单文件、零依赖、本地优先。采用 Bitcoin 字母表（剔除 0/O/I/l 易混字符）将字节序列紧凑编码，用于加密货币地址、短标识与防误读传输（比特币 / IPFS / Solana 底层即 Base58）。

- `b58encode(bytes)` / `b58decode(str)`：字节数组 ↔ Base58（前导零字节映射为前导 `1`）。
- `b58encodeStr(str)` / `b58decodeStr(str)`：UTF-8 文本 ↔ Base58。
- 纯函数、确定性、可断言。

## 测试
```
node _test.js
node smoke.js
```
