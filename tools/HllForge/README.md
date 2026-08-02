# HllForge

HyperLogLog 基数估计器 —— 单文件、零依赖、本地优先。对应 2026 年流式数据 / 可观测性趋势（海量去重计数场景）：以 O(1) 内存近似集合基数。

- `hllCreate(p)`：p 位精度，寄存器数 2^p（默认 12 ≈ 4096，标准误差 ~1%）。
- `hllAdd(hll, item)` / `hllCount(hll)`：插入与估算（含小基数线性计数修正）。
- `hllMerge(a, b)`：同精度合并（取每桶最大值），支持分布式并集计数。

## 测试
```
node _test.js
node smoke.js
```
