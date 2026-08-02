# BeautifyForge

**离线代码美化 / 压缩工具 — JavaScript · CSS · HTML · JSON。单文件，零依赖，数据不出本机。**

Offline code beautifier & minifier for JS / CSS / HTML / JSON. Single HTML file, zero dependencies, your code never leaves your machine.

**在线使用 / Live**: https://wangzifan396-wzf.github.io/WB/tools/BeautifyForge/

## 为什么 / Why

在线 beautifier 网站要把你的代码上传到别人的服务器；Prettier 需要 Node + node_modules。BeautifyForge 是一个可以另存为的单 HTML 文件：

- **零依赖** — 无 npm、无 CDN、无外部请求，`file://` 直接打开即可用
- **隐私** — 代码只在你的浏览器里处理
- **可审计** — 一个文件，全部源码可见可改
- **PWA 离线** — 访问一次后断网可用

## 功能 / Features

| 语言 | 美化 Format | 压缩 Minify |
|------|-------------|-------------|
| JavaScript | 缩进 / 运算符间距 / `} else {` 合并 / 注释保留 | 剥离空白与注释，保留 `+ +` 等歧义空格 |
| CSS | 选择器换行 / 属性缩进 / 嵌套 `@media` | 去注释去空白，保留 `calc()` 与字符串内空格 |
| HTML | 层级缩进 / void 标签识别 / `<script>`/`<style>` 原样保留 | 折叠文本空白 / 删注释 |
| JSON | 2 空格缩进 | 单行 |

- **字符串 / 注释 / 正则感知 tokenizer** — `"a // 不是注释"`、`/re\/gex/g` vs 除号、嵌套模板字符串 `` `${a + `${b}`}` `` 都能正确处理
- **自动语言检测** — Auto 模式按内容识别 JSON / HTML / CSS / JS
- **统计** — 输入/输出字符数与压缩比
- **中英双语 UI**、localStorage 自动保存、`prefers-reduced-motion` 支持

## 内核 API / Kernel

页面顶部 `<script>` 即内核，可直接 `require` 于 Node：

```js
const BF = require('./index.html 的首个 script 抽取'); // 见 _test.js
BF.formatJS('function f(a){return a+1}');  // 缩进美化
BF.minifyJS(src);                          // 压缩且保证可执行
BF.formatCSS(src); BF.minifyCSS(src);
BF.formatHTML(src); BF.minifyHTML(src);
BF.formatJSON(src); BF.minifyJSON(src);
BF.detect(code);                 // 'js' | 'css' | 'html' | 'json'
BF.process(code, 'auto', 'minify'); // { lang, output }
BF.stats(before, after);         // { before, after, saved, ratio }
```

## 测试 / Tests

```bash
node _test.js   # 69 kernel assertions（含自举：压缩自身内核后仍可执行）
node smoke.js   # jsdom full-page smoke（需 jsdom）
```

## 相关 / Related

本工具属于 [nano-tools](https://wangzifan396-wzf.github.io/WB/) 矩阵 — 每个工具一个独立仓库、一个 HTML 文件、零依赖。

## License

MIT
