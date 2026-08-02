# PlanForge

> **nano·tools** — 本地优先（offline-first）的单文件开发者工具矩阵 · 第 11 个旗舰工具

A local-first Gantt / roadmap planner. Plan projects as a timeline of tasks with
start/due dates, progress %, dependencies, lanes, and milestones. Everything stays
in your browser (`localStorage`), no network, no accounts. Export to **PNG / SVG / JSON**.
Part of the [nano-tools](https://github.com/wangzifan396-wzf) matrix, sitting next to
MindForge (mindmaps) and SnipForge (snippets) in the productivity gap.

---

## 功能 / Features

- **任务 Tasks** — `{ id, name, lane, start, end, progress, deps, color, milestone, notes }`.
  泳道（lanes）即分组（Design / Build / Launch …）。
- **甘特时间轴 Gantt timeline** — 横向时间轴（天/周），按泳道分行；条形图按起止日期定位，
  进度覆盖填充；依赖用折线箭头连接；里程碑渲染为菱形；"今天"竖向标记线。
- **编辑 Editing** — 工具栏新增 / 双击空白行新增；侧方面板编辑（名称、泳道、起止、进度、
  依赖多选、里程碑开关、备注）；删除带确认。
- **拖拽排期 Reschedule** — 拖动条形图横向平移日期（也支持直接改起止日期输入）。
- **导入 / 导出 Import / Export** — 导出完整计划为 `.json`；导入时校验结构，畸形文件弹提示，
  绝不 `eval`；导出 PNG（SVG→canvas）、SVG（序列化当前视图）。
- **持久化 Persistence** — `localStorage` 自动保存（键 `planforge.v1`）。
  "新建 / 示例路线图 / 导入 / 导出" 按钮。示例内置 "nano-tools Q3 2026" 真实路线图
  （3 泳道 8 任务 + 1 里程碑）。
- **UX** — 左侧泳道列表与筛选；主甘特画布（拖背景平移、滚轮缩放改变 px/天）；工具栏
  （新增/适应/缩放/导出菜单）；右下角 "nano·tools" 品牌条；中英（zh/en）切换并持久化。
  快捷键：`n` 新建任务，`/` 聚焦搜索。
- **安全 Security** — 所有用户数据经 `textContent` / `.value` 渲染（非 `innerHTML`），避免 XSS；
  无 `eval`；日期用安全解析（手动校验 `YYYY-MM-DD`，拒绝非法日期）。

## 设计系统 / Design system

Locked palette — Linear dark: canvas `#0A0A0B`, card `#141417`, surface `#1A1B1E`,
text `#FFFFFF`/`#A1A1AA`/`#71717A`, border `rgba(255,255,255,0.08)` (strong `0.14`),
accent **only** `#5E6AD2`, success `#10B981`, warning `#F5A623`, info `#22D3EE`,
purple `#A78BFA`. Radius 6–14px. System font stack. Zero external requests.
`prefers-reduced-motion` respected.

## 离线优先 / Offline-first

- 单个 `index.html`，**零外部请求**：无 `<script src>`、无外链 `<link>`、无运行时 `fetch`。
- 由 `template.html` 经 `build.py` 做 **IDENTITY COPY**（读取后原样写出）生成 `index.html`。
  源码 / 构建清晰分离。
- 纯逻辑函数通过 `module.exports` 暴露，供 Node 测试 `require`；全部 UI 在
  `if (typeof window !== 'undefined')` 守卫内。
- PWA：`manifest.webmanifest` + `sw.js`（单文件缓存优先，可离线）。

## 开发 / Develop

```bash
# 1) build (identity copy template.html -> index.html)
python3 build.py

# 2) run tests
node _test.js     # pure-function assertions, 0 failures required
node smoke.js     # jsdom smoke test, jsdomError == 0
```

## 测试 / Tests

- **`_test.js`** — 读取 `index.html`，抽取首个 `<script>` 块，用
  `new Function('module','exports','require', code)` 执行并断言纯函数：`addTask`、
  `updateTask`（字段合并 + 进度夹紧 0..100）、`removeTask`（同时清理悬空依赖）、
  `computeLayout`（按 px/天与泳道行定位的 `x,y,w,h`；仅给 duration 时按 start 计算；
  缺 start 时自动排到依赖之后或项目起点）、`validateImport`（拒绝畸形 JSON / 错误结构 /
  未知字段）、`exportJSON` / `importJSON` 往返、 `todayOffset`、`escapeHtml`，
  以及对 `index.html` 的"零外链"检查（无 `<script src`、无 `<link href="http`、无 `http(s)://`）。
- **`smoke.js`** — jsdom 烟雾测试：加载 `index.html`（`runScripts:'dangerously'`），
  要求 `jsdomError === 0` 且关键根元素（如 `#gantt`）存在。

## 门户元数据 / Portal metadata

- name: **PlanForge**
- icon key: `plan`
- category: 效率 / Productivity
- desc (zh): 本地优先的甘特图 / 路线图规划器：任务、依赖、里程碑、进度，导出 PNG/SVG/JSON，离线可用。
- desc (en): Local-first Gantt / roadmap planner — tasks, dependencies, milestones, progress, export PNG/SVG/JSON, works offline.

---

© nano·tools — offline, zero-dependency developer tools.
