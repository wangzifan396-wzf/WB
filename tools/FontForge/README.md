# FontForge

> **nano·tools** — 本地优先（offline-first）的单文件开发者工具矩阵 · 第 12 个旗舰工具

A local-first **font playground & type-specimen generator**. Drop in a font
(`.ttf` / `.otf` / `.woff` / `.woff2`) or pick a built-in web font, then preview it live —
size, line-height, letter-spacing, weight, italic, alignment, text / background colors —
browse the full **glyph grid** (click to copy the char + `U+XXXX`), and export a polished
**type-specimen** as SVG or PNG (with the font embedded as base64, so the SVG renders
anywhere). Fonts never leave your machine — loading is 100% local via the `FontFace` API,
**zero upload, zero network**. Part of the [nano-tools](https://github.com/wangzifan396-wzf)
matrix, filling the typography gap next to PalettePro (color) and IconForge (icons).

---

## 功能 / Features

- **加载字体 Load fonts** — 拖拽或选择本地 `.ttf/.otf/.woff/.woff2`，用原生 `FontFace` API
  注册到页面（`document.fonts.add`）；也可从内置 web 字体栈里挑选。文件**只在本地读取**，
  绝不上传。
- **实时预览 Live preview** — 字号（12–200）、行高、字距、字重（100–900）、斜体、
  左/中/右对齐、文本色与背景色，全部即时生效。
- **示例文本 Sample text** — 一键切换中文/English pangram/大写/小写/数字/繁体等样本，
  也可自由输入。
- **字形网格 Glyph grid** — 93 个常用字形（拉丁 + 数字 + 标点 + 中文样例）渲染成网格，
  点击即复制该字符与 `U+XXXX` 码点。
- **字体信息 Font info** — 展示已加载字体的名称、文件大小、格式等信息。
- **导出样张 Export specimen** — 生成 1200×760 的排版样张（含 12 列字形网格），导出为
  **SVG**（内嵌 base64 字体，脱离本机也能正确渲染）或 **PNG**。
- **安全 Security** — 所有用户输入经 `textContent` / 属性赋值渲染（非 `innerHTML`），
  避免 XSS；无 `eval`；字体经 `URL.createObjectURL` 本地读取。

## 设计系统 / Design system

Locked palette — Linear dark: canvas `#0A0A0B`, card `#141417`, surface `#1A1B1E`,
text `#FFFFFF`/`#A1A1AA`/`#71717A`, border `rgba(255,255,255,0.08)` (strong `0.14`),
accent **only** `#5E6AD2`. Radius 6–14px. System font stack. Zero external requests.
`prefers-reduced-motion` respected.

## 离线优先 / Offline-first

- 单个 `index.html`，**零外部请求**：无 `<script src>`、无外链 `<link>`、无运行时 `fetch`。
- 由 `template.html` 经 `build.py` 做 **IDENTITY COPY**（读取后原样写出）生成 `index.html`。
- 纯逻辑函数通过 `module.exports` 暴露（`esc` / `formatBytes` / `buildGlyphSet` /
  `buildSpecimenSVG`），供 Node 测试 `require`；全部 UI 在 `if (typeof window !== 'undefined')`
  守卫内。
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
  `new Function('module','exports','require', code)` 执行并断言纯函数：`buildGlyphSet`
  （93 个字形）、`buildSpecimenSVG`（生成合法 SVG，含 12 列网格）、`formatBytes`、`esc`
  （HTML 转义），以及对 `index.html` 的"零外链"检查。
- **`smoke.js`** — jsdom 烟雾测试：加载 `index.html`（`runScripts:'dangerously'`），
  要求 `jsdomError === 0` 且关键根元素（如 `#liveText` 与字形网格）已填充。

## 门户元数据 / Portal metadata

- name: **FontForge**
- icon key: `font`
- category: 设计工具 / Design
- desc (zh): 本地字体预览与排版样张工作台：拖拽加载字体、实时调参、字形网格、导出 SVG/PNG 样张，离线零上传。
- desc (en): Local-first font playground & type-specimen generator — drop in a font, preview live, browse glyphs, export SVG/PNG specimen, offline, zero upload.

---

© nano·tools — offline, zero-dependency developer tools.
