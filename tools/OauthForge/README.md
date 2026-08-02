# OauthForge

OAuth 2.1 体检台：粘贴授权请求 URL，逐项校验 response_type、redirect_uri、state 与 scope，用内置纯 JS SHA-256 真实计算并验证 PKCE 的 code_challenge（S256），解析令牌响应与 JWT 载荷（不验签）检查 alg=none 与过期，并按客户端类型推荐合规流程。排查登录集成、评审授权安全，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/OauthForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
