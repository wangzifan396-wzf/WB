# SwatchForge · 探索式调色板生成器

> 单文件、零依赖、本地优先。空格随机、锁定心仪色块，一键导出 CSS Variables / SCSS / Tailwind / JSON。

**在线使用**：`https://wangzifan396-wzf.github.io/WB/tools/SwatchForge/`

与仓库内其他配色工具的定位差异：SwatchForge 专注**探索式工作流**——像 Coolors 一样按空格快速随机，锁住喜欢的色块继续探索，最后以开发者友好的格式一键导出。

## 功能

- **6 种和谐规则**：类比色 / 单色 / 三元色 / 互补色 / 四元色 / 分裂互补（HSL 色彩空间推导）
- **探索式生成**：按 `空格` 或点按钮随机；锁定的色块保持不变
- **一键复制**：点击色块复制 HEX
- **多格式导出**：CSS Variables / SCSS / Tailwind 配置 / JSON / HEX 列表
- **本地收藏**：调色板存 localStorage（最近 30 组），可回看、删除
- **明暗主题** + 响应式布局
- **PWA**：Service Worker 离线可用（仅缓存本工具命名空间）

## 架构

单文件 `index.html`，纯函数与交互分离：

- `Color` — HEX/RGB/HSL 互转、相对亮度、6 种和谐规则（纯函数，可 headless 测试）
- `Exporter` — 多格式序列化（纯函数）
- IIFE — DOM 渲染与事件绑定

## 测试

```bash
node _test.js   # 纯函数单测（vm + 浏览器 stub，无需 jsdom）
node smoke.js   # jsdom 冒烟测试（需要 jsdom）
```

## License

MIT
