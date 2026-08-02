# DeckForge

> 单文件 · 离线优先的 Markdown 幻灯片编辑器 —— 左边写 Markdown，右边实时预览，一键导出独立 HTML 或打印成 PDF。

[English](#english) | [中文](#chinese)

---

## 中文

DeckForge 是一个**单 HTML 文件**的幻灯片编辑器。你只需要在左侧用 Markdown 写作，右侧就会实时渲染成 16:9 的幻灯片。所有处理都在浏览器本地完成，数据永远不会离开你的设备。

### 特性
- 📝 **实时预览**：Markdown 一边写，幻灯片一边出
- 🧩 **纯 JS 渲染**：内置 Markdown 解析器，零第三方依赖（无 marked / showdown）
- 🔒 **离线优先 / 零依赖**：整个应用内联进一个 `index.html`，运行时零外部请求
- 🎨 **深 / 浅主题** + 中英双语界面
- 🖥️ **演示模式**：上一页 / 下一页、键盘 `←` `→` `空格` `Home` `End`、全屏 `F`、页码计数器、缩略图侧栏
- 📤 **导出**：`打印 / PDF`（`window.print()`，每页一张幻灯片）或导出单文件独立 HTML 幻灯片
- ✅ **XSS 安全**：所有用户输入先 HTML 转义，链接仅允许安全协议
- 📦 **PWA**：`manifest.webmanifest` + `sw.js`，可安装、可离线

### 用法
直接用浏览器打开 `index.html` 即可。无需构建、无需安装。

- 用一行 `---`（单独成行）分隔每一页幻灯片
- 支持 `#` / `##` / `###` 标题，`-` / `*` 无序列表，`1.` 有序列表，`>` 引用，``` 代码块
- 行内支持 `**加粗**`、`*斜体*`、`` `代码` ``、`[链接](url)`、`![图片](src)`
- 键盘：`←`/`→`/`空格` 翻页，`Home`/`End` 跳首尾，`F` 全屏
- 「导出 HTML」会生成一个完全自包含、可单独分享的 `.html` 文件

### 开发
```bash
python3 build.py      # 从 template.html 生成单文件 index.html
node _test.js         # 纯函数测试（解析 / 渲染 / 安全 / 零外部链接）
node smoke.js         # jsdom DOM 冒烟测试
```

---

## English

DeckForge is a **single HTML file** slide editor. Write Markdown on the left and watch it render into 16:9 slides on the right in real time. Everything runs locally in your browser — your data never leaves the device.

### Features
- 📝 **Live preview**: write Markdown, get slides instantly
- 🧩 **Pure-JS renderer**: built-in Markdown parser, zero third-party deps (no marked / showdown)
- 🔒 **Offline-first / zero deps**: the whole app is inlined into one `index.html`; no external requests at runtime
- 🎨 **Dark / light theme** + bilingual (zh/en) UI
- 🖥️ **Presentation mode**: prev/next, keyboard `←` `→` `Space` `Home` `End`, fullscreen `F`, slide counter, thumbnail sidebar
- 📤 **Export**: `Print / PDF` (`window.print()`, one slide per page) or export a self-contained standalone `.html` deck
- ✅ **XSS-safe**: all user input is HTML-escaped first; only safe URL schemes allowed
- 📦 **PWA**: `manifest.webmanifest` + `sw.js` for installable, offline use

### Usage
Just open `index.html` in a browser. No build, no install.

- Separate slides with a single line containing only `---`
- Supports `#` / `##` / `###` headings, `-` / `*` unordered lists, `1.` ordered lists, `>` blockquotes, ``` fenced code blocks
- Inline: `**bold**`, `*italic*`, `` `code` ``, `[link](url)`, `![image](src)`
- Keyboard: `←`/`→`/`Space` to navigate, `Home`/`End` to jump, `F` for fullscreen
- "Export HTML" produces a fully self-contained, shareable `.html` file

### Develop
```bash
python3 build.py      # generate single-file index.html from template.html
node _test.js         # pure-function tests (parse / render / security / zero-external)
node smoke.js         # jsdom DOM smoke test
```

---

Part of the [nano-tools](https://github.com/wangzifan396-wzf) matrix — 单文件 / 离线优先 开源工具集合。

MIT License.
