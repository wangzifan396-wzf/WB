# PlotForge

函数绘图器。输入 `sin(x)*x`、`x^2-4` 等表达式即渲染 SVG 曲线：自研递归下降解析器（优先级/右结合幂/一元负号），非有限值自动断笔。

## 特性
- 支持 `+ - * / ^`、括号、`sin cos tan sqrt abs log exp floor atan`、常量 `pi e`
- 240 点采样、y 轴自适应、坐标轴与断点处理
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
