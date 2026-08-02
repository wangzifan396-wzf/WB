# PercentileForge

延迟分位数分析器 —— 单文件、零依赖、本地优先。p50 / p90 / p95 / p99 线性插值分位数 + 均值 / 样本标准差 + ASCII 直方图，理解可观测性平台（Prometheus / Grafana / Datadog SLO）看延迟的方式：均值会骗人，长尾才是真相。

- `percentile(arr, p)`：排序后线性插值（与 numpy `linear` 一致）；空数组抛 `EMPTY`，p 越界抛 `P_RANGE`。
- `summary(arr)`：count/min/max/mean/stddev/p50/p90/p95/p99 一次算全。
- `histogram(arr, buckets)`：等宽分桶，末桶闭区间。

## 测试
```
node _test.js
node smoke.js
```
