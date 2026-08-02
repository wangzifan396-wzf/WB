# BookForge

离线书签生成器（ScriptExecutor / 油猴思路的本地替代）· 单文件 · 零依赖 · 本地优先。

## 功能
- 粘贴任意 JavaScript → 一键生成可拖入书签栏的 `javascript:` 书签
- 反向解析：粘贴书签还原原始代码
- 生成前做语法校验（new Function），避免坏书签
- 代码始终留在本地，不上传

纯函数：`toBookmarklet` / `fromBookmarklet` / `validateJs` / `stripShebang` —— 见 `_test.js`。
