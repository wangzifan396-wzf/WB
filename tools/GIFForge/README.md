# GIFForge

**离线 GIF 动画制作器 — 单文件 · 零依赖 · 数据不出浏览器**

Offline GIF maker in a single HTML file: drop images or slice a sprite sheet into frames, reorder, tune per-frame delay and looping, then export with a pure-JS GIF89a encoder. Zero dependencies, fully offline.

**在线使用 / Live**: https://wangzifan396-wzf.github.io/WB/tools/GIFForge/

## 功能 Features

- **多图导入**：拖拽 / 多选 / 粘贴图片（PNG / JPG / WebP），按文件名自然排序成帧
- **雪碧图切片**：指定行列数，把精灵图一键拆成动画帧（带网格预览）
- **帧编辑**：拖拽排序、复制帧、逐帧延时（ms）、统一延时一键应用
- **实时预览**：播放 / 暂停 / 逐帧步进，透明棋盘格背景
- **导出控制**：最长边缩放（128–640px / 原始）、调色板 32–256 色、循环开关、有序抖动（Bayer 4×4）
- **纯 JS GIF89a 编码器**：LZW 变长码压缩（含 4096 码表重置）、中位切分量化、透明色支持、NETSCAPE2.0 循环扩展
- **PWA**：Service Worker 离线缓存，可安装

## 纯函数内核 Pure-function kernel

所有编码逻辑均为无副作用纯函数，可在 Node 中直接测试：

| 函数 | 职责 |
| --- | --- |
| `gfLzwEncode(indices, minCodeSize)` | GIF 变长码 LZW 压缩（LSB-first 位打包，4096 满表重置） |
| `gfQuantize(pixels, maxColors)` | 中位切分（median cut）调色板量化 |
| `gfNearest(palette, r, g, b)` | 最近色查找（欧氏距离） |
| `gfIndexFrame(rgba, w, h, palette, opts)` | RGBA → 索引帧（透明映射 + Bayer 抖动） |
| `gfBuildGif(opts)` | 组装完整 GIF89a 字节流（LSD / GCT / NETSCAPE / GCE / 图像块） |
| `gfChunkBytes(bytes)` | 数据流 255 字节子块切分 |
| `gfSliceSheet(w, h, cols, rows)` | 雪碧图网格切片 |
| `gfFit(w, h, maxSide)` | 等比缩放适配 |
| `gfDelayCs(ms)` / `gfU16le(n)` / `gfPaletteBits(len)` | 延时换算 / 小端 u16 / GCT 位宽 |

## 测试 Tests

```bash
node _test.js   # 94 assertions: LZW round-trip (vs reference decoder), GIF structural parse, e2e pipeline
node smoke.js   # jsdom DOM boot smoke (requires jsdom)
```

`_test.js` 内置一个独立实现的参考 LZW 解码器与 GIF 结构解析器，对编码输出做逐字节 round-trip 验证；并经 libvips 真实解码器交叉确认。

## 隐私 Privacy

无网络请求、无统计、无上传 — 所有帧数据与编码全部在你的浏览器内完成。

## License

MIT — part of the [nano-tools](https://wangzifan396-wzf.github.io/WB/) matrix.
