# SecretForge

密钥 / 凭证扫描器 —— 单文件、零依赖、本地优先。对应 2026 年 AI 安全趋势（strix 等 AI 渗透测试、system_prompts_leaks 对敏感信息泄露的关注）：在提交前本地扫描代码、配置与日志中的高危串，永不外传。

- `scan(text)`：正则规则覆盖 AWS Access Key / AWS Secret / GitHub Token / Slack / Google API / Stripe / 私钥 / JWT / 口令赋值，并附加高熵串（Shannon 熵 > 3.8）启发式。返回 `{rule, match, index}` 列表。
- `entropy(s)`：Shannon 熵计算，用于高熵启发式与误报抑制。

## 测试
```
node _test.js
node smoke.js
```
