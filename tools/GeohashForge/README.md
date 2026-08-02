# GeohashForge

Geohash 编解码与邻居计算 —— 单文件、零依赖、本地优先。地理索引 / 附近的人 / Redis GEO 背后的经典网格编码。

- `ghEncode(lat, lon, precision)`：经纬交替二分，5 bit 一字符（base32 无 `a/i/l/o` 字母表），精度 1-12。
- `ghDecode(hash)`：返回中心点 `{lat, lon}` 与误差半径 `{latErr, lonErr}`。
- `ghBounds(hash)`：单元格包围盒。
- `ghNeighbors(hash)`：8 方向邻居（中心点平移一格重编码，自动处理 180° 经线回绕）。
- 通过公认参考向量：`(57.64911, 10.40744) → u4pruydqqvj`、`ezs42 → (42.605, -5.603)`。

## 测试
```
node _test.js
node smoke.js
```
