# PaletteForge

配色方案生成器。基于色相旋转派生互补 / 三角 / 邻近 / 单色方案，并校验与目标背景的 WCAG 对比度，点选即看——设计配色与无障碍校验小工具。

## 特性
- `hexToRgb` / `rgbToHsl` / `hslToRgb` / `rgbToHex` 色彩空间转换
- `rotHue(hex, deg)` / `palScheme(hex, type)` 派生四类配色
- `wcag(hex1, hex2)` 相对亮度对比度（无障碍）
- 实时预览、对比度提示；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
