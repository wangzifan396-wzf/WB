# CodeForge — 离线前端游乐场

> HTML / CSS / JS 三栏编辑 + 沙箱 iframe 实时预览 + 控制台捕获。**单文件、零依赖、离线优先，数据永不离机。**

在线体验：**https://wangzifan396-wzf.github.io/WB/tools/CodeForge/**

类似 CodePen / JSFiddle，但：

- **单文件** — 整个应用就是一个 `index.html`，双击即用，可放 U 盘、可内网分发、可自行审计每一行代码
- **零依赖 / 零构建** — 没有 npm、没有 Webpack、没有 CDN，断网也 100% 可用
- **数据本地** — 项目保存在浏览器 localStorage，不上传任何服务器

## 功能

| 功能 | 说明 |
|---|---|
| 三栏编辑器 | HTML / CSS / JS 独立编辑，Tab 缩进、行数与体积实时统计 |
| 沙箱实时预览 | `iframe sandbox="allow-scripts"` 隔离执行，输入 400ms 防抖自动运行 |
| 控制台捕获 | `console.log/info/warn/error`、未捕获异常、Promise rejection 全部回传显示 |
| 项目管理 | 保存 / 载入 / 删除多个项目（localStorage，最多 50 个） |
| 导出独立 HTML | 一键导出可脱离 CodeForge 运行的单页作品 |
| 快捷键 | `Ctrl+Enter` 运行 · `Ctrl+S` 保存 · `Tab` 缩进 |
| PWA | 支持安装到桌面，Service Worker 离线缓存 |
| 可拖拽布局 | 拖动中缝调整编辑区 / 预览区高度，移动端自适应单列 |

## 使用

```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地服务（启用 PWA）
python -m http.server 8080
```

## 开发者 API

```js
window.__CODEFORGE__.run()                 // 手动运行
window.__CODEFORGE__.getProject()          // 读取当前项目 {name, html, css, js}
window.__CODEFORGE__.setProject(p)         // 载入项目
window.__CODEFORGE__.buildDoc(h, c, j)     // 组装沙箱文档
window.__CODEFORGE__.exportDoc(h, c, j, t) // 组装可导出文档
```

## 测试

```bash
node _test.js   # 36 个纯函数单元测试
node smoke.js   # jsdom 冒烟测试（需 jsdom）
```

## 技术要点

- **控制台桥接**：向沙箱注入 override 脚本，`postMessage` 回传序列化后的 console 参数（支持对象 / Error / BigInt / 循环安全）
- **JS 错误兜底**：用户代码包裹 `try/catch`，`window.onerror` + `unhandledrejection` 双通道捕获
- **纯函数内核**：核心逻辑（文档组装、序列化、文件名清洗、字节统计）与 UI 分离，可在 Node 中直接测试

## License

MIT — [nano-tools 矩阵](https://github.com/wangzifan396-wzf/WB) 成员 #102
