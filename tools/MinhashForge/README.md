# MinhashForge

MinHash 签名与 Jaccard 相似度估计 —— 单文件、零依赖、本地优先。海量文档去重（搜索引擎 / LLM 训练数据清洗）的核心草图算法。

- `mhShingles(text, k)`：字符级 k-shingle 集合（小写 + 空白归一）。
- `mhSignature(set, n)`：n 个带种子 FNV-1a 哈希族取最小值，得到定长签名。
- `mhEstimate(sigA, sigB)`：签名分量相等比例 ≈ Jaccard 相似度（`P[min h(A) = min h(B)] = J(A,B)`）。
- `mhCompare(a, b, k, n)`：同时给出精确 Jaccard 与 MinHash 估计，直观看误差。

## 测试
```
node _test.js
node smoke.js
```
