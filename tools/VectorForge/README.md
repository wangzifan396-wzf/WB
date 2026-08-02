# VectorForge

向量相似度计算器 —— 单文件、零依赖、本地优先。余弦相似度 / 欧氏距离 / 曼哈顿距离 / 点积 + Top-K 检索，理解 RAG 与向量数据库（Faiss / Milvus / pgvector）的核心度量。

- `cosineSim(a, b)` / `euclidean(a, b)` / `manhattan(a, b)` / `dot(a, b)`：维度不一致抛 `DIM_MISMATCH`，零向量余弦抛 `ZERO_VECTOR`。
- `topK(query, docs, k, metric)`：按相似度降序取前 K（距离类度量取负分统一排序方向）。
- `parseVec(str)`：逗号 / 空格分隔解析，返回 `{value, error}`。

## 测试
```
node _test.js
node smoke.js
```
