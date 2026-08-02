# BloomForge

布隆过滤器 —— 单文件、零依赖、本地优先。概率型集合成员判定，用于去重、缓存穿透防护、欺诈检测（Redis / Cassandra / 浏览器安全浏览均采用）。

- `bloomCreate(m, k, seed)` / `bloomAdd(bf, item)` / `bloomHas(bf, item)`：位数组 + 双重哈希（FNV-1a）。
- `bloomFalsePositiveRate(k, m, n)`：理论误判率 `(1 - e^(-kn/m))^k`。
- 加入的元素必定命中；未加入的元素以可控概率误判。

## 测试
```
node _test.js
node smoke.js
```
