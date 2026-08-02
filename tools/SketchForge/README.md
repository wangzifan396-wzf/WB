# SketchForge

Count-Min Sketch 频次草图 —— 单文件、零依赖、本地优先。流式数据频率估计的标准结构（可观测性 / 重型日志计数场景），以极小内存给出「至多高估」的频次下界。

- `cmsCreate(width, depth, seed)`：默认 64×4，多哈希行降低冲突。
- `cmsAdd(sketch, item, count)` / `cmsCount(sketch, item)`：插入与查询（取各行最小值）。
- `cmsMerge(a, b)`：同形状合并（逐格取最大），支持分布式聚合。

## 测试
```
node _test.js
node smoke.js
```
