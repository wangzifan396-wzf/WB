# ParticleForge

粒子系统模拟器。喷泉、烟花、落雪三种发射器，重力 + 阻力欧拉积分，生命周期透明度衰减，拖尾渲染——游戏特效与物理模拟的入门经典。

## 特性
- `pfEmit(mode, x, y, count, rng)` 三种发射器（可注入种子 RNG，确定性可测）
- `pfStep` 不可变积分步（重力/阻力/出界与寿命裁剪）、`pfAlpha` 生命透明度
- `pfRng` xorshift32 种子随机；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
