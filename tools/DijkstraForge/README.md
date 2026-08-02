# DijkstraForge

Dijkstra 最短路径 —— 单文件、零依赖、本地优先。在非负权重图上求解单源最短路径与路径还原，是路由、地图导航与网络流的基础（OSPF / Google Maps / 知识图谱检索底层即用）。

- `dijkstra(graph, start)` → `{dist, prev}`（graph 为邻接表 `{node:[[neighbor, weight], ...]}`）。
- `dijkstraPath(result, start, target)` → 最短路径节点序列，不可达返回 `null`。
- 纯函数，结果可断言。

## 测试
```
node _test.js
node smoke.js
```
