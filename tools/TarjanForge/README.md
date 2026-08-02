# TarjanForge

Tarjan 强连通分量 —— 单文件、零依赖、本地优先。一次 DFS 求出有向图全部 SCC，并缩点为 DAG；用于依赖环检测、死锁分析、编译器优化。

- `tarjanScc(edges)` → SCC 列表（每个分量内节点排序，确定性输出）。
- `sccCondense(edges)` → `{sccs, compOf, dagEdges}` 缩点图。
- `sccHasCycle(edges)` → 是否含环（非平凡 SCC 或自环）。

## 测试
```
node _test.js
node smoke.js
```
