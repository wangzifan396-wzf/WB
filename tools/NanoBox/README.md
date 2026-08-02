# NanoBox

> 一个文件，装下全部 nano-tools。
> **One file. Every nano-tool.**

NanoBox 是 [nano-tools](https://github.com/wangzifan396-wzf) 矩阵的统一入口——一个**单文件、零依赖、本地优先**的命令面板，模糊搜索全部 31 款单文件工具，并用内联 iframe 即时打开它们的线上 demo。内置一个**安全**的表达式计算器，随手算 `2+3*4`、`sqrt(16)`、`ln(e)`。

- 🔎 **模糊搜索** — 子序列打分，大小写不敏感，自动按分类着色
- 🧮 **内联计算** — 手写 Shunting-yard 求值器（白名单函数，拒绝 `eval`/`Function`），算完一键复制
- ⚡ **即时打开** — 每个工具在同源 iframe 中加载，无需离开页面
- 🎹 **键盘优先** — `⌘K` / `Ctrl+K` 聚焦，`↑↓` 选择，`Enter` 打开，`Esc` 清空
- 🌐 **中英双语** — 右上角一键切换，UI 文本实时重渲染
- 📦 **PWA** — 可安装、可离线（仅缓存同源资源，工具 iframe 不拦截）
- 🔒 **隐私** — 最近使用记录仅存 `localStorage`，不上传任何数据

## 在线使用

👉 https://wangzifan396-wzf.github.io/WB/tools/NanoBox/

## 快捷键

| 按键 | 行为 |
| --- | --- |
| `⌘K` / `Ctrl+K` | 聚焦搜索框 |
| `↑` / `↓` | 在结果间移动 |
| `Enter` | 打开选中工具 / 复制计算结果 |
| `Esc` | 清空搜索 |

## 内联计算器

在搜索框直接输入数学表达式，结果行会显示 `= 值`，回车或点击即可复制：

```
2+3*4           → 14
(1+2)^2         → 9
2^3^2           → 512   (右结合)
sqrt(16)        → 4
-2^2            → -4
ln(e)           → 1
log(100)        → 2
100/8           → 12.5
pi/2            → 1.57079632679
```

支持：`+ - * / % ^`、一元负号、括号、`pi e tau` 常量，以及 `sqrt cbrt sin cos tan asin acos atan ln log log2 abs floor ceil round exp sign`。

## 收录的 31 款工具

文本处理 · 开发辅助 · 可视化 · 设计 · 实用计算 · 编码加密 · 效率笔记 · 任务管理 —— 全部来自 nano-tools 矩阵，每一款都是单文件、零依赖、可离线运行。

## 本地运行

无需构建，双击 `index.html` 即可（PWA 与 iframe 在 `file://` 下功能降级，建议用本地静态服务器获得完整体验）：

```bash
npx serve .        # 或 python3 -m http.server
```

## 开发

```bash
node _test.js      # 纯函数单元测试（50 项）
node smoke.js      # jsdom 冒烟测试（14 项，需先 npm i jsdom）
```

## 许可证

[MIT](LICENSE) © 2026 wangzifan396-wzf
