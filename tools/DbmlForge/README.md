# DbmlForge

> DBML 转 SQL DDL：双方言生成、外键推导、Mermaid ER 导出与 schema 体检，离线可用 · 单文件 · 零依赖 · 本地优先

**单文件 · 零依赖 · 离线可用 · 数据永不离机**

## 在线使用

- 打开：<https://wangzifan396-wzf.github.io/WB/tools/DbmlForge/>
- 或下载 `index.html`，双击即可在本地运行（无需联网、无需安装）。

## 特性

- **单文件**：整个工具就是一个 `index.html`，没有构建步骤、没有 npm 依赖。
- **零依赖**：不加载任何 CDN、字体或第三方脚本。
- **离线优先**：内置 Service Worker，装一次即可断网使用。
- **隐私**：所有计算在你的浏览器里完成，数据不会发送到任何服务器。

## 测试

```bash
node _test.js    # 纯函数内核单元测试
node smoke.js    # jsdom 页面加载冒烟测试
```

## 相关

本工具属于 [nano-tools 矩阵](https://wangzifan396-wzf.github.io/WB/)，一个由单文件网页工具组成的开源合集。

## 许可

MIT
