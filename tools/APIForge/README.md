# APIForge · 离线 REST / GraphQL 客户端

> 单文件、零依赖、本地优先的 **API 调试客户端**（one-file Postman）：请求构建 → 鉴权 → 一键发送 → 响应可视化 → 历史记录。
> 属于 [nano-tools](https://github.com/wangzifan396-wzf) 单文件开发者工具矩阵。

[![live demo](https://img.shields.io/badge/demo-online-brightgreen)](#在线试用)
[![license](https://img.shields.io/badge/license-MIT-blue)](#)
[![single-file](https://img.shields.io/badge/single%20file-1%20HTML-orange)](#)

## ✨ 特性

- 🧩 **单文件**：整个应用就是一个 `index.html`，双击即开，无需安装、无需服务器
- 🚫 **零依赖 / 离线**：纯原生 `fetch`，运行时**不发任何第三方请求**（除你发起的 API 调用外），数据永不离机
- 🔧 **请求构建**：Method（GET/POST/PUT/PATCH/DELETE/HEAD/OPTIONS）+ URL，参数 / 请求头 / 请求体分栏编辑
- 🔐 **鉴权**：无 / Bearer / Basic 一键注入 `Authorization` 头
- 🔗 **GraphQL**：勾选即切到 Query + Variables 模式，自动封装 `query` 请求体
- ⚡ **响应可视化**：状态码分级着色（2xx 绿 / 3xx 黄 / 4xx·5xx 红）、耗时与体积统计、JSON 自动美化、响应头表格
- 🕘 **历史记录**：自动存入 `localStorage`，一键回填，最多保留 30 条
- 🌐 **中英双语**：界面一键切换，偏好记忆
- 🎨 **暗色主题**：Linear 风格，护眼一致

## 🖥 在线试用

打开 `index.html` 即可。也可访问 GitHub Pages 在线 Demo（仓库启用后自动生成）。

## 🚀 用法

1. 选择 Method、填入 URL（如 `https://api.github.com/repos/wangzifan396-wzf/GraphForge`）
2. 在「参数 / 请求头 / 请求体 / 鉴权」各栏按需填写
3. 点「发送」，右侧实时显示状态码、耗时、体积与响应体
4. 点「保存」把当前请求加入历史，随时回填

## 🛠 开发

源码在 `template.html`，由 `build.py` 产出单文件 `index.html`：

```bash
python build.py   # 产出 index.html（纯原生，无第三方库）
```

> 发布时只需 `index.html` 一个文件。

## ✅ 测试

```bash
node _test.js     # 纯函数单测（URL 解析 / 头构建 / 鉴权 / 状态分级 / 格式化）
node smoke.js     # jsdom 加载冒烟（UI 初始化无致命错误）
```

## 📄 许可证

MIT © nano-tools
