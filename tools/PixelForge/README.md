# PixelForge — 离线像素画 / 精灵图编辑器

> 单文件、零依赖、完全离线的像素画与精灵图编辑器。画笔、橡皮、填充、取色、直线、矩形、X 轴镜像、网格缩放、24 色调色板、动画帧 + 洋葱皮 + FPS 预览，导出 PNG@Nx 与雪碧图，localStorage 多项目管理。**数据永不离机。**

在线体验：**https://wangzifan396-wzf.github.io/WB/tools/PixelForge/**

类似 Piskel / Pixelorama / Aseprite，但：

- **单文件** — 整个应用就是一个 `index.html`，双击即用，可放 U 盘、可内网分发、可自行审计每一行代码
- **零依赖 / 零构建** — 没有 npm、没有打包器、没有 CDN，断网也 100% 可用
- **数据本地** — 项目保存在浏览器 localStorage，不上传任何服务器

## 功能

| 功能 | 说明 |
|---|---|
| 绘图工具 | 画笔 / 橡皮 / 填充（4 连通洪水填充）/ 取色 / 直线（Bresenham）/ 矩形框 |
| X 轴镜像 | 开启后所有笔触沿中线对称绘制 |
| 网格与缩放 | 可调网格叠加，画布在 1x–16x 间缩放预览 |
| 调色板 | 24 色预设 + 透明通道，点选即取色，支持 HEX 输入 |
| 动画 | 多帧管理、洋葱皮（前后帧半透明叠加）、FPS 可调的实时预览 |
| 画布 | 8×8 至 64×64 尺寸切换、按 Nx 缩放导出 |
| 导出 | PNG@Nx（透明保留）、横向雪碧图（sprite sheet），均一键下载 |
| 撤销 / 重做 | 最多 60 步历史栈 |
| 项目管理 | 保存 / 载入 / 删除多个项目（localStorage），命名弹窗 |
| 快捷键 | P/E/F/I/L/R/M/G 切工具，Ctrl+Z 撤销、Ctrl+Y 重做 |
| 双语 | 中文 / English 一键切换 |
| PWA | 支持安装到桌面，Service Worker 离线缓存 |

## 使用

```bash
# 方式一：直接打开
双击 index.html

# 方式二：本地服务（启用 PWA / Service Worker）
python -m http.server 8080
# 浏览器访问 http://localhost:8080/
```

## 开发者 API

```js
window.__PIXELFORGE__.getState()        // 读取当前状态 {tool,color,grid,w,h,frames,...}
window.__PIXELFORGE__.setTool(t)        // 设置当前工具
window.__PIXELFORGE__.setColor(hex)     // 设置当前颜色
window.__PIXELFORGE__.drawAt(x,y)       // 在坐标落笔（受镜像开关影响）
window.__PIXELFORGE__.fillAt(x,y)       // 洪水填充
window.__PIXELFORGE__.addFrame()        // 新增动画帧
window.__PIXELFORGE__.undo()            // 撤销
window.__PIXELFORGE__.redo()            // 重做
window.__PIXELFORGE__.save()            // 保存到 localStorage
window.__PIXELFORGE__.listProjects()    // 列出已保存项目
window.__PIXELFORGE__.toggleLang()      // 中英切换
```

## 测试

```bash
node _test.js   # 72 个纯函数单元测试
node smoke.js   # jsdom 冒烟测试（需 jsdom）
```

## 技术要点

- **纯函数内核**：网格创建、set/get、克隆、洪水填充、Bresenham 直线/矩形、镜像、缩放、序列化等核心逻辑与 UI 分离，可在 Node 中直接断言
- **本地优先**：所有数据通过 `localStorage` 持久化，序列化格式带 `app/version/w/h` 校验，解析失败可兜底
- **离线 PWA**：Service Worker 缓存优先策略，断网仍可打开已访问页面

## License

MIT — [nano-tools 矩阵](https://github.com/wangzifan396-wzf/WB) 成员 #103
