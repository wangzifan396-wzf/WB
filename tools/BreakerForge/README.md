# BreakerForge

熔断器（Circuit Breaker）—— 单文件、零依赖、本地优先。2026 年弹性 Agent / 微服务趋势下的基础容错原语：连续失败达到一定阈值后跳闸（OPEN），冷却超时进入半开（HALF_OPEN）探测，成功达到阈值后恢复（CLOSED）。

- `cbCreate({failureThreshold, successThreshold, timeoutMs})`：状态机初始 CLOSED。
- `cbAllow(cb, now)`：时间可注入，`now` 超过 `openedAt+timeoutMs` 时转 HALF_OPEN 并放行。
- `cbSuccess(cb, now)` / `cbFailure(cb, now)`：驱动状态转移。
- 全部纯函数、可复现，适合单元测试与故障注入演练。

## 测试
```
node _test.js
node smoke.js
```
