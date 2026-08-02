# MazeForge

迷宫工坊 —— 单文件、零依赖、本地优先。种子可复现的完美迷宫生成 + BFS 最短路求解，游戏关卡 / 算法教学 / 解谜素材一键出图。

- `mzRng(seed)`：mulberry32 可复现随机源，同种子同迷宫。
- `mzGen(w, h, seed)`：递归回溯（DFS）生成完美迷宫——无环、全连通、通道数恒为 w*h-1（生成树性质），墙体双向对称。
- `mzSolve(maze, sx, sy, ex, ey)`：BFS 最短路 + 前驱回溯，输出路径 / 长度 / 扩展节点数。
- `mzSvg(maze, path)`：暗色 SVG，起点青 / 终点橙 / 解路绿。

## 测试
```
node _test.js
node smoke.js
```
