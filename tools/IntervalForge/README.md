# IntervalForge

区间工具箱（合并 / 交集 / 调度 / 会议室）—— 单文件、零依赖、本地优先。LeetCode 56/253 与活动选择问题的一站式计算器，排班、日程冲突检测直接可用。

- `ivMerge(intervals)`：排序 + 扫描合并重叠区间（相接 `[1,4]+[4,5]` 也合并）。
- `ivSchedule(intervals)`：贪心「最早结束优先」求最大不重叠区间集（活动选择最优解）。
- `ivRooms(intervals)`：事件扫描线求最大并发（最少会议室数），同刻「先结束后开始」可复用。
- `ivIntersect(a,b)` / `ivGaps(intervals)`：两区间交集与合并后的空隙段。

## 测试
```
node _test.js
node smoke.js
```
