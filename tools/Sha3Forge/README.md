# Sha3Forge

SHA-3 / Keccak-256 哈希器 —— 单文件、零依赖、本地优先。FIPS 202 海绵结构（Keccak-f[1600]）纯 JS 实现（BigInt 64 位 lane），支持 SHA3-256 / SHA3-512 / Keccak-256（Ethereum 地址与事件签名所用变体）。

- `sha3_256(text)` / `sha3_512(text)`：NIST FIPS 202 标准填充（0x06）。
- `keccak256(text)`：原始 Keccak 填充（0x01），与以太坊 keccak256 一致。
- UTF-8 编码输入，输出小写 hex；通过 NIST 已知向量断言。

## 测试
```
node _test.js
node smoke.js
```
