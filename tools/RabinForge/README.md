# RabinForge

Rabin-Karp 滚动哈希字符串搜索 —— 单文件、零依赖、本地优先。与矩阵内 KMP / Aho-Corasick 互补，补齐字符串匹配三大经典算法家族。

- `rkSearch(text, pattern)`：base 256 + mod 1e9+7 滚动哈希，哈希命中后逐字符复核（杜绝假阳性），返回全部起始下标（含重叠）。
- `rkSearchMulti(text, patterns)`：多模式批量搜索，返回 `{pattern: [positions]}`。
- `rkHash / rkPow`：多项式哈希与快速幂原语，可单独复用。
- 滚动窗口用 `th - c*top` 增量更新，O(n+m) 平均复杂度。

## 测试
```
node _test.js
node smoke.js
```
