# JuliaForge

Julia 集分形渲染器。固定复参数 c、迭代 z→z²+c，逃逸时间平滑着色渲染——与 Mandelbrot 集互为对偶：Mandelbrot 上每一点都对应一个 Julia 集。

## 特性
- `jlEscape` 逃逸时间 + 平滑迭代值（对数平滑，无色带断层）
- `jlMap` 像素→复平面（保持纵横比）、`jlColor` HSL 渐变着色
- 内置海马谷 / 漩涡 / 星云 / 闪电 / 龙形 5 组经典参数
- 纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
