# LzwForge

LZW 无损压缩编解码器 —— 单文件、零依赖、本地优先。将文本压缩为定长码表，可还原为原文，用于理解无损压缩原理（GIF / TIFF 底层即用 LZW）。

- `lzwCompress(str)` → 码表数组（数字）。
- `lzwDecompress(codes)` → 还原文本。
- 纯函数，往返（round-trip）无损；重复内容压缩比显著下降。

## 测试
```
node _test.js
node smoke.js
```
