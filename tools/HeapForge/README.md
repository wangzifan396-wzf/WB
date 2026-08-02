# HeapForge

二叉堆（最小 / 最大）—— 单文件、零依赖、本地优先。数组实现的可持久化（返回新数组）堆操作，是堆排序、优先队列与 Dijkstra 等算法的基础（Go / Rust / Java 标准库优先队列底层即堆）。

- `heapPush(arr, val, cmp)` / `heapPop(arr, cmp)`：插入 / 弹出并返回新堆（默认最小堆 `a<b`）。
- `heapify(arr, cmp)` / `heapSort(arr, cmp)`：建堆与排序。
- 纯函数，不修改入参。

## 测试
```
node _test.js
node smoke.js
```
