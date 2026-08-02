# StructForge

离线 JSON 结构生成器 · 单文件 · 零依赖 · 本地优先。

## 功能
- JSON → TypeScript interface（嵌套对象自动拆分接口）
- JSON → Go struct（含 `json` tag）
- JSON → Python dataclass（typing List/Optional）
- JSON → JSON Schema（draft-07）

## 纯函数
`toTypeScript` / `toGoStruct` / `toPython` / `toJsonSchema` / `pascal` —— 见 `_test.js`。
数据不出本机，粘贴 API 响应即可即时生成类型。
