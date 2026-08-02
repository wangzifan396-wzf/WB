# VoronoiForge

Voronoi 图生成器。放置站点，实时计算平面上每点的最近邻站点并着色，生成细胞状的分形图案——经典计算几何与生成设计工具。

## 特性
- 最近邻查询内核 `vNearest(sites, x, y)`（纯函数、可断言）
- `vGrid(sites, w, h, step)` 网格化赋值，用于测试与离屏计算
- `vColors(n)` 生成均匀分布色相的配色
- 点击画布增点、随机生成、清空；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
