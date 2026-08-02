# PivotForge

交叉表透视器 —— 单文件、零依赖、本地优先。把 CSV 明细行透视为「行维度 × 列维度」交叉表，支持 sum / count / avg / min / max 聚合与行列总计，理解 BI 与分析引擎（Excel 数据透视表 / ClickHouse / Elasticsearch aggregations）的核心操作。

- `parseCsv(text)`：首行表头的简版 CSV 解析，列数不匹配报错。
- `pivot(rows, rowKey, colKey, valKey, agg)`：返回 `{rows, cols, matrix, rowTotals, colTotals, grand}`；无数据单元为 `null`。
- 维度键排序输出，结果可复现可断言。

## 测试
```
node _test.js
node smoke.js
```
