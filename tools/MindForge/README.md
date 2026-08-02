# MindForge · 本地优先思维导图

> 单文件、零依赖、本地优先的 **思维导图 / 节点图编辑器**：结构化节点树、自动布局、折叠、配色、导入导出、离线可用。
> 属于 [nano-tools](https://github.com/wangzifan396-wzf) 单文件开发者工具矩阵。

[![single-file](https://img.shields.io/badge/single%20file-1%20HTML-orange)](#)
[![offline](https://img.shields.io/badge/offline-zero--dependency-blue)](#)
[![license](https://img.shields.io/badge/license-MIT-green)](#)

---

# MindForge · Local-first Mindmap

> A **single-file, zero-dependency, local-first** mindmap / node-graph editor: structured node trees, auto-layout, collapse, branch coloring, import/export — works fully offline.
> Part of the [nano-tools](https://github.com/wangzifan396-wzf) single-file developer toolkit matrix.

---

## ✨ 特性 / Features

- 🧩 **单文件 (Single file)**：整个应用就是一个 `index.html`，双击即开，无需安装、无需服务器。
- 🚫 **零依赖 / 离线 (Zero-dep / offline)**：运行时**不发任何网络请求**，数据永不离机。
- 🌳 **结构化节点树 (Structured trees)**：根节点 + 子节点，自动绘制父子连线（贝塞尔曲线）。
- 📐 **自动布局 (Auto-layout)**：横向整洁树状布局，新增/删除/编辑后自动重算；可拖拽到手动位置，子节点跟随；「重新布局」一键还原。
- ✏️ **编辑 (Editing)**：双击节点编辑文字；`Tab` 加子节点、`Enter` 加同级、`Del` 删除、点击折叠点折叠/展开子树。
- 🎨 **分支配色 (Branch colors)**：从 Linear 调色板（indigo / teal / green / amber / purple / info）选取分支颜色，子树继承。
- 🖐️ **画布交互 (Canvas)**：拖拽空白平移、滚轮缩放、`F` 适应屏幕、左下角小地图 (minimap)。
- 📤 **导入 / 导出 (Import / Export)**：导出 / 导入 JSON（含格式校验），导出 PNG 与 SVG（自动保护不支持的环境，不崩溃）。
- 🔍 **搜索 (Search)**：高亮匹配节点。
- 💾 **持久化 (Persistence)**：localStorage 自动保存，提供「新建」与「示例」(nano-tools 路线图)。
- 🌐 **中英双语 (Bilingual)**：界面一键切换，偏好记忆。
- 🔒 **安全 (Secure)**：节点文字经 `textContent` / 转义渲染，杜绝 XSS，无 `eval`。

## 🖥 用法 / Usage

直接打开 `index.html` 即可（也可部署到任意静态托管或 GitHub Pages）。

| 操作 Action | 快捷键 Shortcut |
| --- | --- |
| 添加子节点 Add child | `Tab` |
| 添加同级 Add sibling | `Enter` |
| 删除节点 Delete | `Del` / `Backspace` |
| 适应屏幕 Fit | `F` |
| 缩放 Zoom | 滚轮 / `+/-` |
| 编辑文字 Edit text | 双击节点 double-click |
| 平移画布 Pan | 拖拽空白处 drag background |

## 🛠 开发 / Develop

源码在 `template.html`，由 `build.py` 原样复制生成单文件 `index.html`：

```bash
python build.py   # 产出 index.html（与 template.html 完全一致，可独立分发）
```

> 发布时只需 `index.html` 一个文件。

## ✅ 测试 / Tests

```bash
node _test.js     # 纯函数单测（addNode / removeNode / moveNode / toggleCollapse / layout / exportJSON / importJSON / searchNodes / escapeHtml + 零外链检查）
node smoke.js     # jsdom 冒烟测试（页面加载无致命错误，UI 正常初始化）
```

## 📄 许可证 / License

MIT © nano-tools
