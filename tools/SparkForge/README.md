# SparkForge

数据序列 → SVG 迷你折线图 / 柱状图 —— 单文件、零依赖、本地优先。

- `line(values, {width, height, fill, dot, stroke})` 生成折线 + 可选面积填充 + 末点圆点。
- `bars(values, {width, height, color})` 生成柱状迷你图。
- 纯函数返回 SVG 字符串，可直接内联或复制使用。

## 测试
```
node _test.js
node smoke.js
```
