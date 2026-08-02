# WaveForge

水波模拟器。离散二维波动方程 `u_next = (u_left+u_right+u_up+u_down)/2 − u_prev`，点击激起波纹，阻尼参数控制扩散速度与衰减，观察波的干涉与反射。

## 特性
- `waveInit(w,h)` / `wavePoke(state, x, y, amp)` / `waveStep(state, damp)` 纯函数内核
- 暂停、清屏、阻尼滑杆；点击画布激起波纹
- 纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
