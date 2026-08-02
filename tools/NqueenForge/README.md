# NqueenForge

N 皇后求解器 —— 单文件、零依赖、本地优先。回溯 + 列/两对角线剪枝，任意解棋盘渲染，经典解数一键成表（8 皇后 = 92）。

- `nqSolve(n, limit)`：回溯求解，total 全量计数与解存储分离（limit 只限存储不影响计数），附扩展节点数。
- `nqValidate(cols)`：独立校验器——列冲突 / 对角线冲突 / 越界全查。
- `nqCounts(maxN)`：1..N 解数表（1,0,0,2,10,4,40,92,352,724）。
- `nqSvg(cols)`：暗色棋盘 SVG，皇后 ♛ 落子。

## 测试
```
node _test.js
node smoke.js
```
