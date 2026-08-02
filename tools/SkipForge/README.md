# SkipForge

跳表（Skip List）—— 单文件、零依赖、本地优先。Redis 有序集合（zset）的底层结构：概率分层的有序链表，期望 O(log n) 查找 / 插入 / 删除。

- `slCreate(seed)`：**种子化 xorshift32** 决定节点层级 → 结构完全可复现、可单测（p=0.5，最多 16 层）。
- `slInsert(sl, key, val)`：重复键更新值不增 size；`slSearch` / `slDelete` / `slRange(lo, hi)` / `slToArray`。
- 压测：1000 乱序键插入后保持严格有序。
- UI 支持批量 `30, 10, 20=twenty` 语法与区间查询。

## 测试
```
node _test.js
node smoke.js
```
