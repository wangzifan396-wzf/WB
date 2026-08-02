# ImgConvertForge

浏览器本地图片格式转换器。PNG / JPEG / WebP 互转，可调压缩质量与最大宽度，Canvas 本地完成、不上传任何数据，实时显示转换前后体积对比。

## 特性
- `icMime / icExt / icName` 格式与文件名推导（纯函数、可断言）
- `icQuality` 质量钳制（PNG 无损自动忽略），`icFit` 等比缩放不放大
- `icDataUrlBytes` 从 dataURL 精确估算输出体积
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
