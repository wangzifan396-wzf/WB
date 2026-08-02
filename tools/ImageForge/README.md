# ImageForge

> **nano·tools** — 本地优先（offline-first）的单文件开发者工具矩阵 · 第 13 个旗舰工具

A local-first **raster image editor** built on native Canvas. Load an image, then
**crop / resize / rotate / flip**, apply **adjustments** (brightness · contrast · saturation ·
hue · blur) and **filters** (grayscale · invert · sepia), then **export** to PNG / JPEG / WebP
(with quality). The image is processed entirely in-browser via `Canvas` / `FileReader` —
**zero upload, zero network, zero third-party libraries**. Fills the real editing gap next to
SnapCompress (compress-only) in the [nano-tools](https://github.com/wangzifan396-wzf) matrix.

---

## 功能 / Features

- **加载图片 Load** — 拖拽或选择本地图片（PNG / JPEG / WebP / GIF 首帧），用 `FileReader` 在
  本地读取，绝不上传。
- **裁剪 Crop** — 在画布上拖拽选取裁剪框，比例锁定可选（1:1 / 4:3 / 16:9 / 自由）。
- **缩放 Resize** — 按宽度/高度自由缩放，可锁定宽高比；纯函数 `computeResize` 计算目标尺寸。
- **旋转翻转 Rotate / Flip** — 90° 步进旋转、`rotateDims` 正确换算画布尺寸；水平/垂直翻转。
- **调色 Adjustments** — 亮度 / 对比度 / 饱和度 / 色相 / 模糊，实时预览（CSS `filter` 即时、
  导出时落到像素），`buildFilterCSS` 生成滤镜串。
- **滤镜 Filters** — 灰度 / 反相 / 棕褐（sepia）。`adjustPixels` 在导出前逐像素应用（保证导出
  结果与预览一致）。
- **导出 Export** — PNG / JPEG / WebP（带质量滑块），文件名由 `exportName` 生成
  （`imageforge-<ts>.<ext>`）。
- **安全 Security** — 所有用户输入经 `textContent` / 属性赋值渲染（非 `innerHTML`），避免 XSS；
  无 `eval`；图片经 `URL.createObjectURL` 本地读取。

## 设计系统 / Design system

Locked palette — Linear dark: canvas `#0A0A0B`, card `#141417`, surface `#1A1B1E`,
text `#FFFFFF`/`#A1A1AA`/`#71717A`, border `rgba(255,255,255,0.08)` (strong `0.14`),
accent **only** `#5E6AD2`. Radius 6–14px. System font stack. Zero external requests.
`prefers-reduced-motion` respected.

## 离线优先 / Offline-first

- 单个 `index.html`，**零外部请求**：无 `<script src>`、无外链 `<link>`、无运行时 `fetch`。
- 由 `template.html` 经 `build.py` 做 **IDENTITY COPY**（读取后原样写出）生成 `index.html`。
- 纯逻辑函数通过 `module.exports` 暴露（`clamp` / `esc` / `formatBytes` / `computeResize` /
  `rotateDims` / `clampCrop` / `buildFilterCSS` / `adjustPixels` / `extForMime` /
  `exportName`），供 Node 测试 `require`；全部 UI 在 `if (typeof window !== 'undefined')`
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
  `new Function('module','exports','require', code)` 执行并断言纯函数：`computeResize`、
  `rotateDims`、`clampCrop`、`buildFilterCSS`、`adjustPixels`、`extForMime`、`exportName`、
  `formatBytes`、`esc`，以及对 `index.html` 的"零外链"检查。
- **`smoke.js`** — jsdom 烟雾测试：加载 `index.html`（`runScripts:'dangerously'`），
  要求 `jsdomError === 0` 且关键根元素（stage / drop / export）已就绪。

## 门户元数据 / Portal metadata

- name: **ImageForge**
- icon key: `image`
- category: 设计工具 / Design
- desc (zh): 本地优先的单文件图片编辑器：裁剪、缩放、旋转翻转、亮度/对比度/饱和度/色相/模糊调整、滤镜，导出 PNG/JPEG/WebP，离线零上传。
- desc (en): Local-first single-file image editor — crop, resize, rotate/flip, brightness/contrast/saturation/hue/blur, filters, export PNG/JPEG/WebP. Offline, zero upload.

---

© nano·tools — offline, zero-dependency developer tools.
