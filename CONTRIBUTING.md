# 参与贡献 · nano-tools 矩阵

nano-tools 是一组**单文件、零依赖、离线优先**的网页工具矩阵（28 款工具 + WB 门户 + nano-workbench 聚合器）。

## 工具骨架约定
每个工具都是**一个 `index.html`**，遵循统一范式：
- 纯逻辑函数用 `if (typeof module !== 'undefined' && module.exports) { ... }` 导出，便于 Node 端单元测试；
- UI 初始化用 `if (typeof window !== 'undefined') { ... }` 守卫，避免在非浏览器环境报错；
- 不引入外部 CDN/脚本（离线优先）；仅使用系统字体栈与 CSS 变量设计系统。

## 本地开发
1. 在 `template.html` 中编写工具（结构与 `index.html` 一致）；
2. 运行质量门禁：
   - `node _test.js` —— 纯函数断言；
   - `node smoke.js` —— jsdom 渲染冒烟测试（要求 0 错误）；
3. 通过后用 `python build.py` 生成 `index.html`（纯原生工具为 identity 拷贝；含第三方库时内联占位符）。

## 提交规范
- 单一职责：一个 PR 只做一件事；
- 提交信息用 `feat:` / `fix:` / `docs:` / `chore:` 前缀；
- 工具需附带 `_test.js`、`README.md`、`og.svg`、`.github/workflows/test.yml`。

## 新增一款工具
1. 在对应目录创建 `template.html` + 上述质量文件；
2. 在 `WB/index.html` 的 `TOOLS` 数组与 `ICONS` / `EN` 字典中添加卡片（保持「28 款工具 / 30 仓库」口径）；
3. 开源到 GitHub 并启用 Pages。

欢迎提 Issue 与 PR！
