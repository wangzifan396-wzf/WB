# InterestForge

复利与贷款计算器 —— 单文件、零依赖、本地优先。

- `compound(principal, rate, years, {frequency})`：复利终值，支持年/季/月/日复利。
- `amortize(principal, annualRate, years)`：等额本息摊销，返回月供、总利息与逐期明细表。

## 测试
```
node _test.js
node smoke.js
```
