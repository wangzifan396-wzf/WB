# FractalForge

分形画廊 —— 单文件、零依赖、本地优先。三大经典分形纯函数生成 + SVG 渲染，数学之美开箱即得。

- `frMandelPoint(cr, ci, maxIter)`：逃逸时间算法（|z|>2 出圈），集合内点返回 maxIter。
- `frKoch(order)`：雪花线段细分，段数 3·4^n，周长每阶 ×4/3（无限周长有限面积）。
- `frSierpinski(order)`：三角形递归挖空，个数 3^n，总面积每阶 ×3/4。
- `frSvg(kind, order)`：暗色 SVG——Mandelbrot 点阵 / Koch 折线 / Sierpinski 线框。

## 测试
```
node _test.js
node smoke.js
```
