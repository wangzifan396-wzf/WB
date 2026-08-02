# GeoForge

地理距离计算器 —— 单文件、零依赖、本地优先。Haversine 大圆距离 + 初始方位角 + 目的地推算 + 包围盒，理解位置服务（附近的人 / 骑手派单 / 地理围栏 / PostGIS `ST_DWithin`）的几何内核。

- `haversine(a, b)`：地球平均半径 6371.0088 km，北京—上海约 1067 km。
- `bearing(a, b)`：初始方位角（0° 北、90° 东）。
- `destination(a, bearing, distKm)`：沿方位角走指定距离的落点（与 haversine 互为往返）。
- `boundingBox(center, radiusKm)`：先粗筛后精算的经典查询优化。

注：本工具为纯几何计算，不涉及地图渲染与行政边界。

## 测试
```
node _test.js
node smoke.js
```
