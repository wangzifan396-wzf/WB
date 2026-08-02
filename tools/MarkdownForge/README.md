# MarkdownForge

Markdown 转 HTML 编译器 —— 单文件、零依赖、本地优先。支持标题 / 加粗 / 斜体 / 行内代码 / 代码块 / 链接 / 有序无序列表 / 引用 / 分隔线 / 段落合并，输出前先做 HTML 转义防注入，理解 AI 输出渲染与静态站生成（marked / remark / MkDocs）的解析内核。

- `mdToHtml(md)`：逐行状态机解析，块级元素优先，段落多行合并。
- `inlineMd(s)`：行内 `code` → `**bold**` → `*em*` → `[link](url)` 的顺序替换。
- `escapeHtml(s)`：先转义再替换，`<script>` 注入会被转成实体。

## 测试
```
node _test.js
node smoke.js
```
