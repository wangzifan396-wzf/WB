<p align="center"><img src="og.svg" alt="nano-tools 预览" width="720">  <img src="https://img.shields.io/github/actions/workflow/status/wangzifan396-wzf/DataForge/test.yml?style=flat-square" alt="CI">
</p>
# DataForge

> 离线优先的 JSON / CSV / TOML 互转工具 —— 在浏览器里完成数据格式转换，数据不上传。

[![Stars](https://img.shields.io/github/stars/wangzifan396-wzf/DataForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/DataForge/stargazers)
[![Forks](https://img.shields.io/github/forks/wangzifan396-wzf/DataForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/DataForge/network/members)
[![Issues](https://img.shields.io/github/issues/wangzifan396-wzf/DataForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/DataForge/issues)
[![Last Commit](https://img.shields.io/github/last-commit/wangzifan396-wzf/DataForge?style=flat)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/DataForge/commits/main)
[![HTML5](https://img.shields.io/badge/HTML5-zero--dependency-5E6AD2?logo=html5&logoColor=white)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/DataForge)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?logo=opensourceinitiative&logoColor=white)](LICENSE)

🌐 **在线试用：** https://wangzifan396-wzf.github.io/WB/tools/DataForge/

## 特性
- **零依赖、单文件**：只有 `index.html`，双击即用。
- **本地优先**：转换在浏览器内完成，数据不出本机。
- **多格式互转**：JSON ⇄ CSV ⇄ TOML，支持嵌套表、数组表、标量数组。
- **实时转换**：输入即转（防抖），可一键交换源/目标、复制结果。
- **明暗主题**。

## 使用
打开页面，选择源格式与目标格式，粘贴内容即可。CSV 仅支持「对象数组」（首行为表头）。

### 支持的转换
| 源 → 目标 | 说明 |
|---|---|
| JSON → CSV | 对象数组 → 表格（首行表头） |
| CSV → JSON | 表格 → 对象数组 |
| JSON ⇄ TOML | 嵌套表、数组表、标量数组均保留 |
| TOML → JSON | 完整还原结构 |

## 技术栈
纯 HTML + CSS + 原生 JS。CSV / TOML 解析与序列化均为手写实现，无任何第三方库。

## 测试
```bash
node _test.js   # 纯函数单测（CSV/TOML round-trip）+ jsdom 功能测试
```

## License
[MIT](LICENSE)
