# XlsxForge

纯前端 Excel 生成器。粘贴 CSV，浏览器内直接打包出标准 `.xlsx` 下载：数字单元格自动写 `<v>`，文本走 `inlineStr`，A1 引用列名进位（Z→AA→…→AAA）全覆盖。

## 特性
- 自实现 CRC32 + STORED ZIP 容器（5 部件 OOXML 最小集）
- `xlColName` 26 进制列名（1→A、27→AA、703→AAA）
- 数字/文本类型自动识别、XML 转义
- 纯前端、零依赖、离线可用

## 测试
```
node _test.js && node smoke.js
```
