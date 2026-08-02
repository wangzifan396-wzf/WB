# MetaForge

离线 HTML Meta 标签生成器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 一键生成基础 meta + Open Graph + Twitter Card 全套标签
- HTML 属性安全转义；可选项留空自动省略
- 标题 / 描述长度 SEO 检查（60 / 160 字符阈值提示）

纯函数：`esc` / `metaTag` / `ogTag` / `buildMeta` / `checkLengths` —— 见 `_test.js`。
