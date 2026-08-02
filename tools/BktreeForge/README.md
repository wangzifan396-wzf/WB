# BktreeForge

BK 树容错词典查找 —— 单文件、零依赖、本地优先。拼写纠错 / 模糊补全的经典索引：利用编辑距离的三角不等式剪枝，免去全表扫描。

- `bkBuild(words)` / `bkAdd(tree, word)`：按「与父节点的编辑距离」作为边标签插入，重复词自动去重。
- `bkSearch(tree, word, maxDist)`：只递归 `[d-maxDist, d+maxDist]` 区间的子树，结果按距离排序。
- 单测含与暴力扫描的交叉验证，保证剪枝不漏。
- `bkDepth(tree)`：树深度观测。

## 测试
```
node _test.js
node smoke.js
```
