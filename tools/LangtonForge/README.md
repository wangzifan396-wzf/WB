# LangtonForge

Langton's Ant 蚂蚁自动机。规则极简——白格右转、黑格左转、翻色前进——却在一万步后涌现出著名的「高速公路」结构，是涌现复杂性的经典演示。

## 特性
- `laInit / laStep / laRun / laCount` 纯函数内核，状态不可变链式传递
- 环面网格（边界回绕）、多蚂蚁（1–8）并行
- 暂停 / 单步 / 每帧步数可调；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
