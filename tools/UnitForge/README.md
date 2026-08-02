# UnitForge

通用单位换算器 —— 单文件、零依赖、本地优先。覆盖长度、质量、温度、速度、数据、面积、体积、时间、能量、压强十大类。

- `convert(value, from, to, category)`：返回 `{value, error}`。
- 温度为特殊线性换算（C/F/K），其余按基准因子换算。

## 测试
```
node _test.js
node smoke.js
```
