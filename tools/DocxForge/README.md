# DocxForge

纯前端 Word 生成器。粘贴文本（`#` 开头行为加粗标题），浏览器内直接打包出标准 `.docx` 文件下载 —— 自实现 CRC32 与 STORED ZIP 容器 + 最小 OOXML 三件套，全程零依赖。

## 特性
- 自实现 CRC32（通过 `123456789 → 0xCBF43926` 标准向量）
- STORED（无压缩）ZIP：本地头 / 中央目录 / EOCD 手工拼装
- 最小 OOXML：`[Content_Types].xml` + `_rels/.rels` + `word/document.xml`
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
