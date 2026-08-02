# CaseForge

离线文本大小写转换与行工具。纯前端、零依赖、数据永不离机。

## 功能
- **大小写转换**：camelCase / PascalCase / snake_case / kebab-case / CONSTANT_CASE / Train-Case / dot.case / path/case / Title Case / Sentence case。自动识别空格、连字符、下划线及驼峰边界。
- **行工具**：去重、升/降序排序、加前缀/后缀、加行号、反转行序、去除行首尾空格。
- **实时统计**：字符、非空字符、词、行、字节数。

## 用法
直接用浏览器打开 `index.html` 即可，无需安装、无需联网。

## 测试
```bash
node _test.js      # 纯函数断言
node smoke.js      # jsdom UI 冒烟（需 npm i jsdom）
```
