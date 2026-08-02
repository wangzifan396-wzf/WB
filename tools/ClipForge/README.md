# ClipForge

CSS clip-path 可视化编辑器。内置三角形、箭头、五角星、六边形、对话框等预设，可插入顶点微调形状，实时预览并生成 `polygon()` 代码。

## 特性
- `cpToCss / cpParse` 双向转换（纯函数、往返一致）
- `cpMidInsert` 边中点插入顶点、`cpClamp` 0–100% 钳制
- 5 组常用预设；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
