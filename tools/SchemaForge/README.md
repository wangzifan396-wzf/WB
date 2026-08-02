# SchemaForge

离线数据库 Schema / ER 图设计器。一个单文件 HTML，零依赖，数据永不出浏览器。

## 功能

- **可视化建模**：拖拽表头移动、滚轮缩放、点击表在侧栏编辑字段
- **字段属性**：名称、类型（INT / VARCHAR / TEXT / BOOL / DATETIME / FLOAT / DECIMAL）、主键、非空、唯一、默认值
- **外键关联**：在字段上选择目标表.字段，自动绘制关系连线并生成 `FOREIGN KEY`
- **多方言 SQL DDL 导出**：MySQL / PostgreSQL / SQLite
- **Mermaid erDiagram 导出**：直接粘贴到 Mermaid 实时预览
- **SVG / PNG 导出**
- **自动保存**：localStorage 本地持久化
- **中英双语**

## 内核（SF）

纯函数顶层，便于测试与复用：

| 函数 | 用途 |
| --- | --- |
| `SF.makeTable` / `SF.makeColumn` | 构造表 / 字段模型 |
| `SF.genDDL(tables, dialect)` | 生成多方言 `CREATE TABLE` |
| `SF.genMermaid(tables)` | 生成 Mermaid erDiagram |
| `SF.genSVG(tables)` | 生成独立 SVG 图 |
| `SF.validate(tables)` | 校验表名 / 列名 / 外键目标 |
| `SF.sampleSchema()` | 内置 blog 示例（users / posts / comments） |
| `SF.autoLayout(tables)` | 网格自动布局 |

## 测试

```bash
node _test.js     # 内核断言（DDL / Mermaid / 校验 / 示例 / round-trip）
node smoke.js     # jsdom 渲染 + 交互冒烟（无 WebGL 环境安全降级）
```

## 隐私

全部计算在浏览器本地完成，不上传任何数据。可作为 PWA 离线使用。
