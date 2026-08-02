# OtelForge

OpenTelemetry 工具：粘贴 OTLP/JSON 的 resourceSpans，解析资源/作用域/span 结构，构建调用链父子树、定位关键路径与慢调用、计算错误率与 P50/P95/P99 延迟，并按最新语义约定（如 http.request.method、url.full）校验埋点质量与凭据泄露风险。排查分布式链路、做 SLO 评审，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/OtelForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
