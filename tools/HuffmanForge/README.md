# HuffmanForge

霍夫曼熵编码压缩器 —— 单文件、零依赖、本地优先。基于字符频率构建最优前缀码，是对 DEFLATE / gzip / JPEG 底层熵编码原理的最小实现（2026 年数据压缩与高效存储仍是系统性能核心）。

- `huffFreq(text)` → 字符频率表。
- `huffBuild(freqs)` / `huffCodes(tree)` → 构建树并生成前缀码（前缀无关、确定性）。
- `huffEncode(text)` / `huffDecode(bits, codes)` → 编码为 bit 串并可无损还原。

## 测试
```
node _test.js
node smoke.js
```
