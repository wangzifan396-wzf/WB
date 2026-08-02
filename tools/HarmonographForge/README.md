# HarmonographForge

谐振图（Harmonograph）生成器。四个阻尼谐振子两两叠加出正弦轨迹，随阻尼衰减收束成优雅的藤蔓状曲线——Generative Art 入门经典。

## 特性
- 纯函数内核 `hmgPoints(p)`：给定振幅/频率/相位/阻尼，返回坐标点序列
- 频率、相位、阻尼实时可调，一键随机探索
- 纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
