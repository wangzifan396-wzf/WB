# ClothForge

布料模拟器。Craig Reynolds 式 Verlet 积分 + 距离约束：顶部钉子固定，重力让布料自然下垂，拖拽可扰动网格观察弹性传播。

## 特性
- `clInit(cols, rows, spacing, ox, oy)` 建网格与约束
- `clStep(state, gravity, drag, iterations)` 纯函数推进一帧（钉点不动、约束收敛）
- 重力/暂停可调，鼠标拖拽交互；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
