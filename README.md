<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/"><img src="https://img.shields.io/github/stars/wangzifan396-wzf/WB?style=flat-square&color=5E6AD2" alt="Stars"></a>
  <img src="https://img.shields.io/github/forks/wangzifan396-wzf/WB?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/github/issues/wangzifan396-wzf/WB?style=flat-square" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/wangzifan396-wzf/WB?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/built%20with-HTML5%20%2B%20Vanilla%20JS-5E6AD2?style=flat-square" alt="HTML5">
  <img src="https://img.shields.io/badge/dependencies-zero-2EA043?style=flat-square" alt="Zero Dep">
  <img src="https://img.shields.io/github/license/wangzifan396-wzf/WB?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/"><strong>🌐 打开门户 Live Portal</strong></a>
</p>

---

# nano-tools · 单文件工具集门户

**一套单文件、零依赖、本地优先的开发者工具矩阵**的总入口。每个工具都是一个 `index.html`——无需安装、无需构建、无需联网，下载即用，数据永远留在你的浏览器里。

> 本仓库首页 `index.html` 是聚合门户站（工具卡片墙 + 搜索 + 分类 + 主题切换）；原「AI 发展趋势」页保留为 [`trends.html`](trends.html)。

## 🧰 工具矩阵

| 工具 | 分类 | 简介 |
|------|------|------|
| [RegexLab](https://wangzifan396-wzf.github.io/RegexLab/) | 文本处理 | 正则实时测试：匹配高亮、捕获组、替换预览、正则库与速查表 |
| [CronText](https://wangzifan396-wzf.github.io/CronText/) | 开发辅助 | Cron 表达式翻译成人话 + 预测未来运行时间 |
| [DiffLens](https://wangzifan396-wzf.github.io/DiffLens/) | 文本处理 | LCS 文本 / JSON 差异对比，并排 + 内联视图 |
| [JsonForge](https://wangzifan396-wzf.github.io/JsonForge/) | 文本处理 | JSON 格式化 / 压缩 / 转 TS 类型 / JSONPath 查询 |
| [HashKit](https://wangzifan396-wzf.github.io/HashKit/) | 编码加密 | Base64/URL/HTML 编解码、SHA-256、JWT 解码、UUID / 密码 |
| [BoxKit](https://wangzifan396-wzf.github.io/BoxKit/) | 开发辅助 | 19 合 1 离线开发者工具箱 |
| [ContextLens](https://wangzifan396-wzf.github.io/ContextLens/) | AI 工具 | LLM 上下文与成本可视化器 |
| [Inkwell](https://wangzifan396-wzf.github.io/Inkwell/) | 效率笔记 | 本地优先 Markdown 知识库（双向链接 + 关系图） |
| [Graphite](https://wangzifan396-wzf.github.io/Graphite/) | 可视化 | SVG 可视化节点编辑器 |
| [Chartify](https://wangzifan396-wzf.github.io/Chartify/) | 可视化 | CSV / JSON 秒变 SVG 图表 |
| [UniConvert](https://wangzifan396-wzf.github.io/UniConvert/) | 实用计算 | 12 类万能单位换算 |
| [SnapCompress](https://wangzifan396-wzf.github.io/SnapCompress/) | 图像工具 | 纯 Canvas 图片压缩 |
| [PalettePro](https://wangzifan396-wzf.github.io/PalettePro/) | 设计工具 | WCAG 对比度 + 配色和谐 + 取色板 |

## ✨ 门户特性

- **工具卡片墙**：图标 + 简介 + 标签 + 在线试用 / 源码双入口
- **实时搜索**：按名称、描述、标签、分类模糊匹配
- **分类过滤**：一键筛选文本处理 / 可视化 / AI 工具等
- **实时统计**：工具总数、分类数、依赖数（永远是 0）
- **明暗主题**：偏好持久化于 `localStorage`
- **卡片鼠标高光** + 极光点阵背景，动效仅用 `transform` / `opacity`

## 🚀 使用

下载 `index.html` 双击打开即可。所有工具均为独立单文件，互不依赖。

## 🧪 测试

```bash
node _test.js
```

门户过滤逻辑为纯函数，附单元测试。

## 📄 License

MIT
