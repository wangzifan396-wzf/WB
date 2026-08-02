# SheetForge

**离线迷你电子表格 — 真·公式引擎。单文件，零依赖，数据不出本机。**

Offline mini spreadsheet with a real formula engine. Single HTML file, zero dependencies, your data never leaves your machine.

**在线使用 / Live**: https://wangzifan396-wzf.github.io/WB/tools/SheetForge/

## 为什么 / Why

在线表格要登录、要联网、要把数据传到云端。SheetForge 是一个可以另存为的单 HTML 文件：

- **零依赖** — 无 npm、无 CDN、无外部请求，`file://` 直接打开即可用
- **真公式引擎** — 不是 `eval()`，是手写 tokenizer + 递归下降解析器 + AST 求值
- **依赖图重算** — 改一个格子，所有下游公式自动按拓扑序重算
- **环检测** — `A1=B1, B1=A1` 显示 `#CYCLE!`，不会死循环
- **PWA 离线** — 访问一次后断网可用

## 功能 / Features

- **A1 引用** — `A1`、`$B$3`、区间 `A1:C5`（支持反向 `C5:A1`）
- **函数** — `SUM / AVG(AVERAGE) / MIN / MAX / COUNT / COUNTA / IF / ABS / ROUND / FLOOR / CEIL / SQRT / POW / MOD / CONCAT / LEN / UPPER / LOWER / TRIM`
- **运算符** — `+ - * / ^ % &`（字符串连接）与比较 `= <> < > <= >=`，`^` 右结合，标准优先级
- **错误模型** — `#DIV/0! #NAME? #NUM! #VALUE! #CYCLE! #PARSE`，错误沿依赖链传播
- **CSV** — 导入 / 导出原始公式 / 导出计算值，带引号转义
- **键盘** — Enter 下移、Tab 右移、Esc 还原；公式栏同步编辑
- **localStorage 自动保存**、中英双语 UI

## 内核 API / Kernel

页面顶部 `<script>` 即内核，可直接在 Node 中使用（见 `_test.js` 的抽取方式）：

```js
const s = SF.makeSheet(20, 10);
SF.setCell(s, 'A1', '10');
SF.setCell(s, 'A2', '=A1*2+SUM(A1:A1)');
SF.display(s, 'A2');            // "30"
SF.parse('IF(A1>5,"big","small")');  // AST
SF.extractRefs(SF.parse('SUM(B1:B3)+C2')); // ['B1','B2','B3','C2']
SF.toCSV(s, true);              // 计算值 CSV
SF.fromCSV('a,b\n1,=A2*2');     // 导入并求值
SF.serialize(s); SF.deserialize(json);
```

## 测试 / Tests

```bash
node _test.js   # 90 kernel assertions（引用/解析/求值/重算/环/CSV/序列化）
node smoke.js   # jsdom full-page smoke（需 jsdom）
```

## 相关 / Related

本工具属于 [nano-tools](https://wangzifan396-wzf.github.io/WB/) 矩阵 — 每个工具一个独立仓库、一个 HTML 文件、零依赖。

## License

MIT
