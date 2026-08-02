# PasswordForge

安全口令生成器 —— 单文件、零依赖、本地优先。可配置长度、字符集（小写/大写/数字/符号）、避开易混字符（Il1O0o）、每类至少含一个，并实时显示**熵估计（bits）**。

- 纯函数内核 `PasswordForgePure.generate({length, lower, upper, digit, symbol, avoidAmbiguous, requireAll, rng})`，`rng` 入参使测试可复现（UI 使用 `crypto.getRandomValues`）。
- 离线可用，口令不上传任何服务器。

## 测试
```
node _test.js     # 纯函数内核断言
node smoke.js     # 浏览器环境冒烟
```
