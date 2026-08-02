# BenchForge

基准测试统计分析器 —— 单文件、零依赖、本地优先。hyperfine 同款统计口径：把一串耗时样本变成可信的结论。

- `bfStats(xs)`：n / mean / 样本标准差 / median / MAD / min / max / P95。
- `bfOutliers(xs)`：modified z-score（`0.6745·(x−median)/MAD > 3.5`）离群点检测，MAD=0 时退化为「偏离中位数即离群」。
- `bfCompare(a, b)`：均值比 + 误差传播（`ratio·√((σA/μA)² + (σB/μB)²)`），输出「A 比 B 快 N.NNx ± e」。
- 粘贴任意分隔（逗号/空格/换行）的耗时序列即可分析。

## 测试
```
node _test.js
node smoke.js
```
