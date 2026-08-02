# OgForge

OG 社交预览卡片生成器。输入标题、副标题与品牌名，Canvas 本地绘制 1200×630 社交预览图，附带完整的 `og:` / `twitter:` meta 标签代码，可直接下载 PNG。

## 特性
- `ogWrap` 按宽度折行（含超长单词硬切）、`ogFontSize` 标题长度自适应字号
- `ogMeta` 生成 7 行社交 meta 代码（含 XSS 转义）
- Linear 暗色卡片风格；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
