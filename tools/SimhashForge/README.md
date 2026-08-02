# SimhashForge

SimHash 64 位近重复检测 —— 单文件、零依赖、本地优先。Google 网页去重同款指纹：改几个词，指纹只翻几个 bit。

- 特征提取：小写归一后取**单词 + 相邻二元组**（带频次加权）。
- `simhash64(text)`：每个特征哈希成 64 bit（双种子 FNV-1a 拼接），按位加权求和取符号 → 16 位 hex 指纹。
- `shHamming(a, b)`：SWAR popcount 计算 64 位海明距离。
- `shCompare(a, b, threshold)`：距离 ≤ 阈值（默认 3）判定近重复。
- 性质保证：单词级微改的距离显著小于无关文本。

## 测试
```
node _test.js
node smoke.js
```
