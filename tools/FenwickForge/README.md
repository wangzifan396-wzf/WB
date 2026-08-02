# FenwickForge

树状数组（Fenwick / Binary Indexed Tree）—— 单文件、零依赖、本地优先。O(log n) 单点更新 + 前缀和 / 区间和查询，是排行榜、频次统计、逆序对计数的核心结构。

- `fwBuild(arr)` / `fwUpdate(fw, i, delta)`：lowbit（`x & -x`）跳跃更新。
- `fwPrefix(fw, i)` / `fwRange(fw, l, r)` / `fwGet(fw, i)` / `fwToArray(fw)`。
- `fwLowerBound(fw, target)`：树上二分，找第一个前缀和 ≥ target 的位置（要求元素非负）。

## 测试
```
node _test.js
node smoke.js
```
