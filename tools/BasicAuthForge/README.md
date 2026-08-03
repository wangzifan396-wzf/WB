# BasicAuthForge

HTTP Basic Auth 工具：把 用户名:密码 编码为 Authorization: Basic &lt;base64&gt; 请求头（纯 JS Base64，含 UTF-8 支持），也可反向解析 Base64 还原用户名与密码，调试接口鉴权时随手可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/BasicAuthForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
