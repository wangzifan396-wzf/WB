# SseForge

Server-Sent Events 工作台：内置符合 WHATWG 规范的 SSE 线格式解析器，正确处理 CRLF/CR/LF 混排、BOM、多行 data 拼接、空 data 不派发与非法 retry 忽略；支持逐字节分块投喂模拟、流体检、EventSource 实时客户端与 Nginx/Node 服务端速查，离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SseForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
