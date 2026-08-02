# SandForge

落沙模拟器。经典元胞自动机：沙粒受重力下落，下方被占用则尝试斜滑，遇墙堆积成丘——像素风物理玩具。

## 特性
- `sandInit(w,h)` / `sandSet(s,x,y,v)` / `sandStep(s)` 纯函数内核（0 空 / 1 沙 / 2 墙）
- `sandCount(s)` 统计沙粒数（守恒校验）
- 画笔绘制沙/墙/橡皮，暂停、清空；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
