# DistForge

字符串距离与相似度套件 —— 单文件、零依赖、本地优先。拼写纠错、模糊去重、姓名匹配的六把标尺，一次算全。

- **Levenshtein**：经典编辑距离（滚动数组 O(min(m,n)) 空间）。
- **Damerau-OSA**：含相邻换位（`ab→ba` 距离 1）。
- **Hamming**：等长逐位比较，不等长返回 `{error}`。
- **Jaro / Jaro-Winkler**：匹配窗口 + 换位计数，Winkler 前缀加成（≤4 字符，p=0.1）；通过 `MARTHA/MARHTA → 0.961111` 等经典向量。
- **Dice 二元组系数**：`2·|A∩B| / (|A|+|B|)`（multiset 口径）。

## 测试
```
node _test.js
node smoke.js
```
