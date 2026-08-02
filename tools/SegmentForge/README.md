# SegmentForge

线段树（区间和 / 最值 + 懒标记区间加）—— 单文件、零依赖、本地优先。竞赛与面试的区间查询标配，与树状数组（Fenwick）互补：支持区间批量更新。

- `stBuild(arr)`：O(n) 建树，同时维护 sum/min/max 三组聚合。
- `stQuery(t, l, r, kind)`：O(log n) 区间查询，`kind ∈ sum|min|max`，越界返回 `{error}`。
- `stUpdate(t, l, r, delta)`：懒标记（lazy propagation）区间加，O(log n)，部分重叠时下推。
- 全闭区间 `[l, r]`、0 起下标，语义与主流题解一致。

## 测试
```
node _test.js
node smoke.js
```
