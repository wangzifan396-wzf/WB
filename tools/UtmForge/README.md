# UtmForge

UTM 参数构建 / 解析 / 校验工具 —— 单文件、零依赖、本地优先。适合增长与营销溯源。

- `build(base, params)`：在基础 URL 上拼接 `utm_source/medium/campaign/term/content`，自动编码并保留已有 query。
- `parse(url)`：从链接中解析出 `utm_*` 与全部参数。
- `validate(params)`：校验必填项（utm_source）与空值。

## 测试
```
node _test.js
node smoke.js
```
