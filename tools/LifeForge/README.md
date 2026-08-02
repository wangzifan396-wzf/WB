# LifeForge

康威生命游戏 —— 单文件、零依赖、本地优先。B3/S23 规则 + 环面边界，四大经典图案预置，可直接编辑棋盘文本步进推演。

- `lfParse(text)`：`.`/`O` 文本棋盘解析，宽度不一致 / 非法字符报错。
- `lfStep(grid)`：标准规则单步（活: 2-3 邻存活；死: 恰 3 复活），环面（toroidal）边界。
- `lfRun(grid, n)`：快进 n 代 + 哈希历史环检测（Blinker 周期 2、静物周期 1）。
- `lfPattern(name, size)`：Glider / Blinker / Block / Pulsar（48 细胞，周期 3）。
- `lfSvg(grid)`：暗色 SVG 网格渲染，活细胞 #10B981。

## 测试
```
node _test.js
node smoke.js
```
