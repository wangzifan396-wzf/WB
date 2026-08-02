# IniForge

INI 配置解析器 —— 单文件、零依赖、本地优先。解析 `[section]` / `key = value`、跳过 `;` 与 `#` 注释、剥离引号，并可反向序列化（Windows / 服务配置 / 游戏与桌面应用长期采用 INI）。

- `iniParse(text)` → 嵌套对象（按 section 分组，值统一为字符串）。
- `iniStringify(obj)` → INI 文本，与 `iniParse` 互逆。
- 纯函数，结果可断言。

## 测试
```
node _test.js
node smoke.js
```
