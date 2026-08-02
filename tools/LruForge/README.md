# LruForge

LRU 缓存 —— 单文件、零依赖、本地优先。容量受限的最近最少使用缓存，命中即移到队尾，超载淘汰队首。

- `lruCreate(capacity)`：用插入有序的 Map 实现，O(1) 读写。
- `lruGet(cache, key)` / `lruPut(cache, key, value)`：命中重排 / 插入或更新（满则淘汰最旧）。
- `lruKeys(cache)` / `lruSize(cache)`：当前键顺序与大小。

## 测试
```
node _test.js
node smoke.js
```
