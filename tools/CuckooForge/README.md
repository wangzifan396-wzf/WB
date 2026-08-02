# CuckooForge

布谷鸟过滤器 —— 单文件、零依赖、本地优先。比布隆过滤器多一个杀手锏：支持删除。指纹 + 双候选桶 + 踢出重放（kick），用于流式去重、缓存准入（CacheLib TinyLFU）、黑名单撤销等需要「可撤销的概率型成员判定」的场景。

- `cuckooCreate(m, b)`：m 须为 2 的幂（异或求备用桶的前提），否则抛 `BUCKETS_POW2`。
- `cuckooInsert(cf, item)`：两桶皆满时随机踢出已有指纹迁移到其备用桶，上限 500 次。
- `cuckooContains / cuckooDelete`：查询「可能存在 / 一定不存在」；删除按指纹摘除。
- `altIndex(i, fp, m)`：`i XOR hash(fp)`，对合性质保证从任一桶都能算出另一桶。

## 测试
```
node _test.js
node smoke.js
```
