# ColorBlindForge · 色觉障碍模拟与配色审计

> 单文件 · 零依赖 · 离线可用的色盲模拟器与无障碍配色审计工具

**在线使用**: https://wangzifan396-wzf.github.io/WB/tools/ColorBlindForge/

## 特性

- **科学模拟内核**：Machado, Oliveira & Fernandes (2009) severity=1.0 矩阵，在**线性 RGB 空间**计算
  - 红色盲 Protanopia（男性约 1%）
  - 绿色盲 Deuteranopia（男性约 1-2%）
  - 蓝色盲 Tritanopia（约 0.01%）
  - 全色盲 Achromatopsia（亮度灰）
- **单色模拟**：任意 HEX → 5 张色卡（原色 + 4 型模拟），取色器联动
- **调色板审计**：每行一个 HEX，5 种视觉类型逐一渲染色带，CIE76 ΔE 低于阈值的颜色对自动标记「难以区分」
- **WCAG 对比度**：前景/背景对比度 + AA/AAA 判级，并给出 4 型色觉下的模拟对比度与实时文本预览
- 离线 PWA、localStorage 记忆、`prefers-reduced-motion` 适配

## 本地使用

下载 `index.html` 双击打开即可，无需构建、无需网络。

## 测试

```bash
node _test.js   # 内核单测（46 断言：矩阵不变量 / WCAG / Lab / 审计）
node smoke.js   # jsdom UI 冒烟（需 jsdom）
```

关键不变量测试：灰色在各型模拟下近似不变、全色盲输出三通道相等、绿色盲下红绿 ΔE 减半以上、黑白对比度精确 21:1。

## 内核 API

页面暴露 `window.__COLORBLINDFORGE__`（Node 环境 `module.exports`）：

```js
CB.simulate('#E74C3C', 'deuteranopia')  // → '#a08b34'
CB.contrast('#000', '#fff')             // → 21
CB.wcagLevel(4.6)                       // → 'AA'
CB.deltaE('#FF0000', '#00A000')         // → CIE76 色差
CB.audit(['#f00', '#0a0'], 12)          // → 各视觉类型下的难区分颜色对
```

## 相关项目

nano-tools 系列 · [全部工具](https://wangzifan396-wzf.github.io/WB/)

## License

MIT
