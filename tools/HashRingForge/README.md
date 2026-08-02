# HashRingForge

一致性哈希环 —— 单文件、零依赖、本地优先。将 key 稳定映射到节点，节点增减时仅少量 key 需迁移，用于分布式缓存 / 分片 / 负载均衡（Dynamo / Redis Cluster / nginx upstream）。

- `ringCreate(nodes, replicas)` / `ringAddNode` / `ringRemoveNode` / `ringGet(ring, key)`。
- 每个节点虚拟出 `replicas` 个虚拟节点，哈希采用 FNV-1a，查找用二分。
- 节点下线后，其负责的 key 平滑迁移到邻近节点。

## 测试
```
node _test.js
node smoke.js
```
