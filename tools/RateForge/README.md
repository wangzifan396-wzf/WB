# RateForge

请求速率限制模拟器 —— 单文件、零依赖、本地优先。实现令牌桶（Token Bucket）与漏桶（Leaky Bucket）两种经典限流算法，用于构建具备韧性的 API 重试与限流逻辑（AI Agent / 微服务基础设施）。

- `TokenBucket(capacity, refillPerSec)` / `tbConsume(bucket, n, now)`：确定性令牌桶，返回 `allowed` / `tokensLeft` / `retryAfterMs`。
- `LeakyBucket(capacity, leakPerSec)` / `lbConsume(bucket, n, now)`：漏桶算法。
- 以「虚拟时钟 now（毫秒）」驱动，纯函数、可断言、可复现。

## 测试
```
node _test.js
node smoke.js
```
