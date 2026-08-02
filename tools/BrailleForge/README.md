# BrailleForge

盲文点阵字符画生成器。内置 5×7 像素字模（A-Z / 0-9），把文字渲染为位图后映射到 Unicode 盲文块（U+2800，每字符 2×4 点），生成可粘贴到任何等宽环境的高密度字符画。

## 特性
- `brFont` 39 字模、`brBitmap` 文字→位图、`brToBraille` 位图→盲文（纯函数）
- 8 点盲文编码（dot1–dot8 位序正确，U+28FF 全点验证）
- 反相模式、一键复制；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
