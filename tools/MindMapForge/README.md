# MindMapForge

思维导图生成器 —— 单文件、零依赖、本地优先。缩进大纲一键变 SVG 思维导图，笔记整理 / 头脑风暴 / 演示配图利器。

- `mmParse(text)`：缩进大纲（2 空格或 Tab 一级）解析为树，跳级缩进 / 多中心主题报错。
- `mmLayout(tree)`：按叶子数分配纵向空间，父节点垂直居中于子树，贝塞尔曲线连线。
- `mmSvg(text)`：一键渲染暗色 SVG，按层级着色，XML 转义防注入。

## 测试
```
node _test.js
node smoke.js
```
