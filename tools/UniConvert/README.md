<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/tools/UniConvert/"><img src="https://img.shields.io/github/stars/wangzifan396-wzf/UniConvert?style=flat-square&color=5E6AD2" alt="Stars"></a>
  <img src="https://img.shields.io/github/forks/wangzifan396-wzf/UniConvert?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/github/issues/wangzifan396-wzf/UniConvert?style=flat-square" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/wangzifan396-wzf/UniConvert?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/built%20with-HTML5%20%2B%20Vanilla%20JS-5E6AD2?style=flat-square" alt="HTML5">
  <img src="https://img.shields.io/badge/dependencies-zero-2EA043?style=flat-square" alt="Zero Dep">
  <img src="https://img.shields.io/github/license/wangzifan396-wzf/UniConvert?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/actions/workflow/status/wangzifan396-wzf/UniConvert/test.yml?style=flat-square" alt="CI">
</p>

<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/tools/UniConvert/"><strong>🌐 在线试用 Live Demo</strong></a>
</p>
<p align="center"><img src="og.svg" alt="nano-tools 预览" width="720"></p>

---

# UniConvert · 万能单位换算器

单文件、零依赖、本地优先的**单位换算器**。12 大类、实时双向换算，打开 `index.html` 即用，数据全程在浏览器内计算、不上传。

## ✨ 功能
- **12 大类**：长度、面积、体积、质量、温度、速度、时间、数据、角度、压强、能量、功率
- **实时双向换算**：输入即算，可一键交换「从/到」
- **常用换算卡片**：点击直接填入示例
- **暗 / 亮主题**，偏好记忆
- **复制结果**一键可用

## 🚀 使用
直接双击 `index.html`（或拖进浏览器）。无需安装、无需联网、无需构建。

## 🧩 技术说明
- 纯原生 HTML / CSS / JS，**零第三方依赖**，单文件自包含
- 换算核心为纯函数 `convert(cat, from, to, value)`，可在 Node 下单测（`node _test.js`，27 项断言）
- 温度使用偏移+比例精确换算；其余单位统一经基准单位换算

## ⚠️ 说明
换算因子为常用近似值，精确工程请以官方标准为准。

## 📄 许可
MIT
