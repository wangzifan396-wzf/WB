# ChatForge · 本地优先 AI 对话

> 单文件、零依赖、本地优先的 **BYOK AI 对话客户端**：自带密钥，直连 OpenAI / Anthropic / OpenRouter，支持流式输出，数据永不离机。
> 属于 [nano-tools](https://github.com/wangzifan396-wzf) 单文件开发者工具矩阵。

[![live demo](https://img.shields.io/badge/demo-online-brightgreen)](#在线试用)
[![license](https://img.shields.io/badge/license-MIT-blue)](#)
[![single-file](https://img.shields.io/badge/single%20file-1%20HTML-orange)](#)

## ✨ 特性

- 🧩 **单文件**：整个应用就是一个 `index.html`，双击即开，无需安装、无需服务器
- 🚫 **零依赖 / 离线**：纯原生 `fetch`，运行时**不发任何第三方请求**（除你主动发起的模型调用外）
- 🔑 **BYOK（自带密钥）**：密钥只存浏览器 `localStorage`，请求**直达服务商，无中间服务器**——隐私归你
- 🌐 **多家服务**：OpenAI / Anthropic / OpenRouter，自动拼对应端点与鉴权头
- ⚡ **流式输出**：SSE 实时逐字渲染（OpenAI 与 Anthropic 双协议解析），可一键关闭
- 💬 **完整对话**：用户 / 助手气泡、系统提示词、清空重开、token 粗略估算
- 🌐 **中英双语**：界面一键切换，偏好记忆
- 🎨 **暗色主题**：Linear 风格，护眼一致

## 🖥 在线试用

打开 `index.html` 即可。也可访问 GitHub Pages 在线 Demo（仓库启用后自动生成）。

## 🚀 用法

1. 左侧选择服务商、填入模型与 API Key（勾选「保存密钥」可暂存于本地）
2. （可选）填写系统提示词
3. 在右侧输入框发消息，Enter 发送、Shift+Enter 换行
4. 回复以流式逐字显示；点「清空对话」重置上下文

> 密钥仅保存在你自己的浏览器里，不会被任何中间服务器看到。

## 🛠 开发

源码在 `template.html`，由 `build.py` 产出单文件 `index.html`：

```bash
python build.py   # 产出 index.html（纯原生，无第三方库）
```

> 发布时只需 `index.html` 一个文件。

## ✅ 测试

```bash
node _test.js     # 纯函数单测（端点/鉴权头/请求体/SSE 解析/key 校验/token 估算）
node smoke.js     # jsdom 加载冒烟（UI 初始化无致命错误）
```

## 📄 许可证

MIT © nano-tools
