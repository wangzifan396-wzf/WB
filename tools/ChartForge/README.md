# ChartForge

离线数据图表生成器。一个单文件 HTML，零依赖，数据永不出浏览器。

## 功能

- **多格式输入**：CSV / TSV / JSON（对象数组或二维数组），自动识别数值列
- **六种图表**：柱状图、折线图、面积图、饼图、环形图、散点图
- **Canvas 渲染**：清晰高分，本地完成
- **统计面板**：每列 sum / avg / min / max 实时计算
- **导出**：PNG（白底）+ SVG（矢量，可二次编辑）
- **中英双语**

## 内核（CF）

纯函数顶层，便于测试与复用：

| 函数 | 用途 |
| --- | --- |
| `CF.parseCSV` / `CF.parseTSV` / `CF.parseJSON` / `CF.parseData` | 解析为 `{headers, rows}` |
| `CF.isNumericCol(rows, i)` | 判断某列是否为数值列 |
| `CF.stats(rows, i)` | 单列统计（sum/avg/min/max/count） |
| `CF.niceTicks(min, max, n)` | 生成美观的坐标轴刻度 |
| `CF.buildScene(w, h, data, opts)` | 构建与渲染器无关的图元场景 |
| `CF.renderCanvas(ctx, scene)` | 场景 → Canvas2D（无 GL 时安全降级） |
| `CF.renderSVG(scene)` | 场景 → SVG 矢量图 |
| `CF.sampleData()` | 内置示例数据集 |

## 测试

```bash
node _test.js   # 内核断言（解析 / 统计 / 刻度 / 六种图表场景 / 双渲染器）
node smoke.js   # jsdom 渲染 + 交互冒烟（无 WebGL 环境安全降级）
```

## 隐私

全部计算在浏览器本地完成，不上传任何数据。可作为 PWA 离线使用。
