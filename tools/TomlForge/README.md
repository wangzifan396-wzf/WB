# TomlForge

TOML 解析器（子集）—— 单文件、零依赖、本地优先。将 TOML 文本解析为嵌套对象，支持字符串 / 整数 / 浮点 / 布尔 / 数组 / 表 `[t]` / 数组表 `[[t]]` 与注释（2026 年配置文件格式之争中，TOML 在 Rust / Python pyproject / 容器编排中广受采用）。

- `tomlParse(text)` → 嵌套 JS 对象（确定性解析）。
- 支持 `[table]` 嵌套、`[[array-of-tables]]`、行内数组与转义字符串。
- 纯函数，结果可断言。

## 测试
```
node _test.js
node smoke.js
```
