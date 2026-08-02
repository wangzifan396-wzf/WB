# BackoffForge

指数退避与抖动计算器 —— 单文件、零依赖、本地优先。用于构建具备韧性的 API 重试逻辑（AI Agent / 微服务基础设施）。

- `expDelay(attempt, opts)`：确定性基础延迟 `min(cap, base * factor^attempt)`。
- `backoff(attempt, opts, rng)`：支持 `full` / `equal` / `none` / `decorrelated`（AWS）四种抖动策略。

## 测试
```
node _test.js
node smoke.js
```
