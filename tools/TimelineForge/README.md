# TimelineForge

时间线生成器。`日期 | 标题 | 描述` 一行一事件（支持 `YYYY` / `YYYY-MM` / `YYYY-MM-DD` 三种粒度），自动按时间排序后渲染左右交替卡片时间线 SVG。

## 特性
- 日期严格校验 + 可排序整数 key，输入顺序无关
- 左右交替布局、节点着色轮换、SVG 一键复制
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
