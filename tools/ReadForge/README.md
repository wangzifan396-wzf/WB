# ReadForge

文本可读性评分器 —— 单文件、零依赖、本地优先。基于 Flesch Reading Ease 与 Flesch-Kincaid 年级公式评估英文写作质量。

- `fleschReadingEase(text)`：返回分数（越高越易读，0–100 常见）。
- `fleschKincaidGrade(text)`：返回对应美国年级水平。
- 另提供 `countWords` / `countSentences` / `countSyllables` 基础统计。

## 测试
```
node _test.js
node smoke.js
```
