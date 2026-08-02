# TableForge

离线表格工作台 —— 单文件 · 零依赖 · 本地优先。

把 CSV / TSV / JSON 数组粘进来，即可在浏览器里完成：单元格编辑、增删行/列、按列排序、关键词筛选、分组聚合（求和/均值/计数/最值），并一键导出为 TSV、CSV、Markdown 表格、HTML 表格或 JSON。所有计算都在本地完成，不联网、不上传、不引任何第三方库。

## 功能

- 粘贴即解析：自动识别逗号 / Tab / 分号分隔符，支持带引号的字段（含嵌入逗号、转义引号）
- 可编辑网格：双击单元格直接改，自动本地保存
- 增删行列、一键转置
- 按任意列升/降序排序（数字按数值、文本按字典序）
- 按列包含关键词筛选
- 分组聚合：按组列对值列做求和 / 均值 / 计数 / 最小 / 最大
- 导出：复制 TSV、下载 CSV、复制 Markdown、复制 HTML、复制 / 下载 JSON

## 用法

直接双击 `index.html` 在浏览器打开即可；或部署到任意静态托管（GitHub Pages 已开启）。

## 纯函数（可在 Node 下单测）

`parseDelimited` / `toDelimited` / `toMarkdown` / `toHTML` / `toJSON` / `transpose` / `sortRows` / `filterRows` / `aggregate` / `columnStats` —— 见 `_test.js`。

## 开发

```bash
python build.py      # index.html -> index.html (identity)
node _test.js        # 纯函数断言
node smoke.js        # DOM 冒烟（需 jsdom）
```

## 协议

MIT · [nano-tools](https://github.com/wangzifan396-wzf)
