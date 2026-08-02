# WordCloudForge

词云生成器 —— 单文件、零依赖、本地优先。粘贴文本即出 SVG 词云，报告封面 / 周会总结 / 评论分析一眼看出高频词。

- `wcTokenize(text)`：英文按单词小写化、中文按 2 字滑窗、数字保留。
- `wcCount(tokens, opts)`：词频统计 + 停用词过滤 + 最短词长过滤，按频次降序（同频字典序）。
- `wcLayout(freqs, opts)`：阿基米德螺旋布局，包围盒碰撞检测保证零重叠，频次线性映射字号 14–44。
- `wcSvg(text, opts)`：一键渲染暗色 SVG，Top3 加粗，XML 转义防注入。

## 测试
```
node _test.js
node smoke.js
```
