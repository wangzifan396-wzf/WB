# MinesweeperForge

扫雷游戏。种子化布雷、计数提示、Flood-fill 自动翻开空白区、右键插旗，自动判定胜负——经典逻辑游戏的纯前端实现。

## 特性
- `msCreate(w,h,mines,seed)` 种子化建盘（确定性）
- `msReveal(s,x,y)` 翻开（踩雷返回 hit；空格 Flood-fill）
- `msToggleFlag(s,x,y)` / `msWin(s)` 旗标与胜利判定
- 三档难度、左键翻开、右键插旗；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
