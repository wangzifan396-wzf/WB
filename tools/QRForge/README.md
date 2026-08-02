# QRForge

> 单文件 · 离线优先的二维码生成器 —— 在浏览器里生成**真实 QR 码**，纯前端、零依赖、无需联网。

[English](#english) | [中文](#chinese)

---

## 中文

QRForge 是一个**单 HTML 文件**的二维码生成器。它把公共领域的 `qrcode-generator` 库直接内联进页面，因此可以在完全离线、零外部请求的环境下生成**真实可用的二维码**（支持文本 / URL / WiFi / 名片 vCard / 邮件 / 短信），数据永远不会离开你的设备。

### 特性
- 🔲 **真实 QR 编码**：基于 [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator)（公共领域），不是占位图片
- 📦 **单文件 / 零依赖**：整个应用（含引擎）内联进一个 `index.html`，运行时零外部请求
- 🔒 **离线优先**：PWA（manifest + service worker），数据留在本地，不上传任何服务器
- 🧩 **六种模式**：文本 / URL / WiFi (`WIFI:S:...;;`) / 名片 vCard / 邮件 / 短信
- 🎛️ **可调参数**：纠错等级 L/M/Q/H、尺寸、静区、前景/背景色
- 🖼️ **SVG 预览 + PNG 导出**：原生 SVG 渲染清晰锐利，PNG 通过 `<canvas>` 离线导出
- 🌗 **中英双语 + 深/浅主题**

### 用法
直接用浏览器打开 `index.html` 即可。无需构建、无需安装。

- 选择模式、填写内容后自动生成（或点「生成二维码」）
- 「导出 SVG」/「导出 PNG」保存图片，「复制文本」复制待编码原文

### 开发
```bash
python3 build.py      # 从 template.html 注入 qrcode 库，生成 index.html
node _test.js         # 纯函数测试
node smoke.js         # jsdom DOM 冒烟测试
```

---

## English

QRForge is a **single HTML file** QR code generator. It inlines the public-domain `qrcode-generator` library directly into the page, so it generates **real, scannable QR codes** fully offline with zero external requests — for Text / URL / WiFi / vCard / Email / SMS — while your data never leaves the device.

### Features
- 🔲 **Real QR encoding** via [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (public domain) — not a placeholder image
- 📦 **Single file / zero deps**: the whole app (engine included) is inlined into one `index.html`; no external requests at runtime
- 🔒 **Offline-first**: PWA (manifest + service worker), data stays local, nothing is uploaded
- 🧩 **Six modes**: Text / URL / WiFi (`WIFI:S:...;;`) / vCard / Email / SMS
- 🎛️ **Tunable**: error-correction L/M/Q/H, size, quiet zone, foreground/background color
- 🖼️ **SVG preview + PNG export**: crisp native SVG rendering; PNG exported via offline `<canvas>`
- 🌗 **Bilingual (zh/en) + dark/light theme**

### Usage
Just open `index.html` in a browser. No build, no install.

- Pick a mode and fill content — the QR generates live (or click "Generate")
- "Export SVG" / "Export PNG" to save; "Copy text" to copy the encoded string

### Develop
```bash
python3 build.py      # inject the qrcode lib into template.html -> index.html
node _test.js         # pure-function tests
node smoke.js         # jsdom DOM smoke test
```

---

Part of the [nano-tools](https://github.com/wangzifan396-wzf) matrix — 单文件 / 离线优先 开源工具集合。
