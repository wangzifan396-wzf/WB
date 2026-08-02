# UnionForge

并查集（Union-Find / Disjoint Set）—— 单文件、零依赖、本地优先。路径压缩 + 按秩合并，近乎常数时间，用于连通分量、动态连通性、Kruskal 最小生成树。

- `ufMake()` / `ufAdd(uf, x)`：创建与动态加入节点（字符串或数字均可）。
- `ufFind(uf, x)`：带路径压缩的根查找。
- `ufUnion(uf, a, b)`：按秩合并。
- `ufConnected(uf, a, b)` / `ufCount(uf)`：连通判定与连通分量数。

## 测试
```
node _test.js
node smoke.js
```
