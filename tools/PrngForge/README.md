# PrngForge

可复现随机数生成器 —— 单文件、零依赖、本地优先。同一种子永远得到同一序列，用于测试固件、模拟仿真、生成式艺术与游戏（`Math.random` 不可播种，这是它的补位）。

- `prngCreate(algo, seed)`：mulberry32 / sfc32 / xoshiro128**，种子经 MurmurHash3 派生。
- `prngSequence(algo, seed, n)` / `prngIntRange(algo, seed, n, lo, hi)`。
- `prngShuffle(algo, seed, arr)`：确定性 Fisher-Yates 洗牌（不改原数组）。

## 测试
```
node _test.js
node smoke.js
```
