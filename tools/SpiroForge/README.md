# SpiroForge

万花尺生成艺术。内旋轮线（hypotrochoid）与外旋轮线（epitrochoid）参数方程实时绘制，gcd 自动计算闭合周期，一键随机探索参数空间并导出 SVG。

## 特性
- 精确闭合：按 r/gcd(R,r) 周期采样，首尾点重合（测试保证）
- d=0 退化为圆、包络半径钳制等数学性质均有断言
- 随机参数探索 + SVG 下载
- 纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
