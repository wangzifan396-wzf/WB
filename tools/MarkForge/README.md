<p align="center"><img src="og.svg" alt="nano-tools 预览" width="720">  <img src="https://img.shields.io/github/actions/workflow/status/wangzifan396-wzf/MarkForge/test.yml?style=flat-square" alt="CI">
</p>
# MarkForge

> 离线优先的 Markdown 实时编辑器 —— 边写边预览，一键导出独立 HTML，数据不上传。

[![Stars](https://img.shields.io/github/stars/wangzifan396-wzf/MarkForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MarkForge/stargazers)
[![Forks](https://img.shields.io/github/forks/wangzifan396-wzf/MarkForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MarkForge/network/members)
[![Issues](https://img.shields.io/github/issues/wangzifan396-wzf/MarkForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MarkForge/issues)
[![Last Commit](https://img.shields.io/github/last-commit/wangzifan396-wzf/MarkForge?style=flat)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MarkForge/commits/main)
[![HTML5](https://img.shields.io/badge/HTML5-zero--dependency-5E6AD2?logo=html5&logoColor=white)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MarkForge)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?logo=opensourceinitiative&logoColor=white)](LICENSE)

🌐 **在线试用：** https://wangzifan396-wzf.github.io/WB/tools/MarkForge/

## 特性
- **零依赖、单文件**：只有 `index.html`，双击即用。
- **本地优先**：解析与渲染全在浏览器内完成，内容不出本机。
- **实时预览**：左侧写、右侧即时渲染。
- **快捷工具栏**：加粗 / 斜体 / 行内代码 / 链接，自动包裹选区。
- **一键导出**：导出为独立的 standalone HTML 文档，或复制 HTML。
- **中英文字数统计**：字符 / 词 / 行，CJK 单独计数。
- **明暗主题**。

## 支持的语法
标题、加粗、斜体、行内代码、链接、图片、有序 / 无序列表、引用、表格、代码块（```）、分隔线、段落。所有输入均做 XSS 转义。

## 使用
打开页面，在左侧编辑区输入 Markdown，右侧实时预览。点击「导出 HTML」下载独立文档，或「复制 HTML」拷贝渲染结果。

## 技术栈
纯 HTML + CSS + 原生 JS。Markdown 解析器为手写实现，无任何第三方库。

## 测试
```bash
node _test.js   # 纯函数单测（Markdown → HTML）+ jsdom 功能测试
```

## License
[MIT](LICENSE)
