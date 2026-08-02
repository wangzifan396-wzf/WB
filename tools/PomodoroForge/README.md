# PomodoroForge

番茄钟。纯函数状态机驱动：25 分钟专注 → 5 分钟短休，每 4 个番茄自动进入 15 分钟长休；完成数与轮次统计、进度条着色区分工作/休息。

## 特性
- `pomoTick / pomoNextPhase / pomoToggle` 全部纯函数，状态不可变链式传递
- 可注入配置（时长、长休间隔）便于测试
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
