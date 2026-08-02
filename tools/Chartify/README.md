<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/tools/Chartify/"><img src="https://img.shields.io/github/stars/wangzifan396-wzf/Chartify?style=flat-square&color=5E6AD2" alt="Stars"></a>
  <img src="https://img.shields.io/github/forks/wangzifan396-wzf/Chartify?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/github/issues/wangzifan396-wzf/Chartify?style=flat-square" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/wangzifan396-wzf/Chartify?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/built%20with-HTML5%20%2B%20Vanilla%20JS-5E6AD2?style=flat-square" alt="HTML5">
  <img src="https://img.shields.io/badge/dependencies-zero-2EA043?style=flat-square" alt="Zero Dep">
  <img src="https://img.shields.io/github/license/wangzifan396-wzf/Chartify?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/actions/workflow/status/wangzifan396-wzf/Chartify/test.yml?style=flat-square" alt="CI">
</p>

<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/tools/Chartify/"><strong>🌐 在线试用 Live Demo</strong></a>
</p>
<p align="center"><img src="og.svg" alt="nano-tools 预览" width="720"></p>

---

# Chartify · 数据图表生成器

单文件、零依赖、本地优先的**数据→图表生成器**。粘贴 CSV 或 JSON，一键生成柱状 / 折线 / 饼图（SVG），可导出 PNG。数据仅在浏览器内解析，不上传。

## ✨ 功能
- **输入格式**：CSV（首行表头，逗号分隔，支持引号包裹含逗号的字段）/ JSON 数组（对象数组或数字数组）
- **三种图表**：柱状图、折线图、饼图
- **列选择**：自由指定「标签列」与「数值列」
- **导出**：SVG（矢量，可进 Figma）、PNG（2× 高清）
- **暗 / 亮主题**

## 🚀 使用
直接双击 `index.html`。粘贴数据 → 选图表类型与列 → 生成 → 导出。

## 🧩 技术说明
- 纯原生 HTML / CSS / JS，**零第三方依赖**，单文件自包含
- 解析与绘图核心为纯函数（`parseCSV` / `parseInput` / `extractSeries` / `buildBar` / `buildLine` / `buildPie`），可在 Node 下单测（`node _test.js`，26 项断言）
- 图表为手写 SVG，无图表库

## 📄 许可
MIT
