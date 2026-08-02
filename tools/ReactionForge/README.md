# ReactionForge

反应扩散（Gray-Scott）图案生成器。两种化学物质在网格上扩散并反应，自发涌现出斑点、条纹、迷宫等图灵斑图——生成艺术与形态发生的经典模型。

## 特性
- `rdInit(w,h)` / `rdSumB(s)` / `rdStep(s, f, k, Da, Db, dt)` 纯函数内核
- 参数 f（投料）/ k（消耗）实时可调，点击画布局部播种
- 纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
