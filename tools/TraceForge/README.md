# TraceForge

链路追踪瀑布图。粘贴 span JSON（`name/start/dur/parent`），按 parent 链缩进层级渲染耗时瀑布 SVG：时间网格、每层着色、最慢 span 红色高亮。

## 特性
- 严格校验：重复 name、缺失 parent、非法时长、parent 环全部报错
- `trcStats` 求总耗时（max(start+dur)）与最慢 span
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
