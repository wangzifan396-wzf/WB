# MurmurForge

MurmurHash3 x86_32 非加密哈希计算器 —— 单文件、零依赖、本地优先。Bloom filter、一致性哈希、分片路由的标配哈希函数，输入按 UTF-8 编码，支持自定义种子与分桶。

- `murmurStr(str, seed)` / `murmur3_32(bytes, seed)`：标准 MurmurHash3 x86_32，通过维基百科全部参考向量。
- `murmurHex(str, seed)`：8 位十六进制输出。
- `murmurBucket(str, seed, n)`：`hash % n` 分桶，用于分片 / AB 实验。
- 纯 32 位整数运算（`mmMul32` 拆高低 16 位避免精度丢失），无 BigInt、无外部依赖。

## 测试
```
node _test.js
node smoke.js
```
