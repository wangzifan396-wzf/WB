# 2048Forge

2048 合并游戏。方向键移动，相邻相同数字合并翻倍，棋盘填满且无可合并即结束——经典合并解谜，纯函数内核可断言、可种子复现。

## 特性
- `g2Init(seed)` / `g2Move(board, dir)` / `g2Spawn(board, rng)` 纯函数内核（dir: 0上 1右 2下 3左）
- `g2Over(board)` / `g2Won(board)` 终局与胜利判定
- 方向键操作、分数、重开；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
