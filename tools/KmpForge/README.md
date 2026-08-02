# KmpForge

KMP 字符串匹配 —— 单文件、零依赖、本地优先。Knuth-Morris-Pratt 线性时间匹配：失配函数（部分匹配表）+ 单趟扫描，支持重叠命中与高亮。

- `kmpFailure(pattern)` → 失配函数数组（每个前缀的最长真前后缀长度）。
- `kmpSearch(text, pattern)` → 全部命中起点（含重叠）；`kmpCount` / `kmpFirst`。
- `kmpHighlight(text, pattern)` → 用【】标注非重叠命中的可视化结果。

## 测试
```
node _test.js
node smoke.js
```
