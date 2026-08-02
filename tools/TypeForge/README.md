# TypeForge

离线 JSON → TypeScript 接口生成器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 粘贴 JSON，一键生成 `export interface` 定义
- 嵌套对象自动展开为独立接口（按键名 PascalCase 命名）
- 数组元素类型推断（含联合类型 `(A | B)[]`、空数组 `any[]`）
- 非法标识符键名自动加引号
- 自定义根接口名

## 纯函数
`jsonToInterfaces` / `inferType` / `parseSafe` / `pascalCase` / `propKey` / `singular` —— 见 `_test.js`。

数据仅在浏览器本地处理，不上传、不联网。
