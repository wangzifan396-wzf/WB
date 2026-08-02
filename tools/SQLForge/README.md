# SQLForge

> 单文件 · 离线优先的 SQL 数据库客户端 —— 在浏览器里运行**真实 SQLite**，零依赖、无需服务器。

[English](#english) | [中文](#chinese)

---

## 中文

SQLForge 是一个**单 HTML 文件**的 SQL 工作台。它把 SQLite 编译成 WebAssembly 直接跑在浏览器中，因此你可以编写并执行**真正的 SQL**（SELECT / JOIN / CREATE / INSERT / 视图 / 索引……），而数据永远不会离开你的设备。

### 特性
- 🗄️ **真·SQLite 引擎**：基于 [sql.js](https://github.com/sql-js/sql.js)（SQLite → WASM），不是玩具正则解析器
- 📦 **单文件 / 零依赖**：整个应用（含引擎）内联进一个 `index.html`，运行时零外部请求
- 🔒 **离线优先**：数据留在本地，不上传任何服务器
- 🧩 **开箱即用示例库**：users / products / orders 三表关联，一键载入 JOIN 示例查询
- 📥 **导入导出**：打开 `.sqlite` 文件；从 CSV / JSON 自动建表；结果导出 CSV / JSON；数据库导出 `.sqlite`
- 🌗 **中英双语 + 深/浅主题**
- 🕘 **查询历史**（localStorage，最多 30 条）

### 用法
直接用浏览器打开 `index.html` 即可。无需构建、无需安装。

- `Ctrl/⌘ + Enter` 执行查询
- 点击左侧表名或列名可快速生成查询
- 把 `.sqlite` / `.csv` / `.json` 文件拖入页面即可打开

### 开发
```bash
python3 build.py      # 从 template.html 注入 SQL 引擎，生成 index.html
node _test.js         # 纯函数测试
node smoke.js         # jsdom DOM 冒烟测试
```

---

## English

SQLForge is a **single HTML file** SQL workbench. It runs **real SQLite** (compiled to WebAssembly) directly in your browser, so you can write and execute **actual SQL** (SELECT / JOIN / CREATE / INSERT / views / indexes…) while your data never leaves the device.

### Features
- 🗄️ **Real SQLite engine** via [sql.js](https://github.com/sql-js/sql.js) (SQLite → WASM) — not a toy regex parser
- 📦 **Single file / zero deps**: the whole app (engine included) is inlined into one `index.html`; no external requests at runtime
- 🔒 **Offline-first**: data stays local, nothing is uploaded
- 🧩 **Sample DB out of the box**: related `users` / `products` / `orders` tables, one-click sample JOIN query
- 📥 **Import / Export**: open `.sqlite`; auto-create tables from CSV / JSON; export results to CSV / JSON; export DB to `.sqlite`
- 🌗 **Bilingual (zh/en) + dark/light theme**
- 🕘 **Query history** (localStorage, up to 30 entries)

### Usage
Just open `index.html` in a browser. No build, no install.

- `Ctrl/⌘ + Enter` to run
- Click a table or column in the sidebar to generate a query
- Drag a `.sqlite` / `.csv` / `.json` file onto the page to open it

### Develop
```bash
python3 build.py      # inject the SQL engine into template.html -> index.html
node _test.js         # pure-function tests
node smoke.js         # jsdom DOM smoke test
```

---

Part of the [nano-tools](https://github.com/wangzifan396-wzf) matrix — 单文件 / 离线优先 开源工具集合。
