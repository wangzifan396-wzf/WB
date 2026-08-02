# WebSocketForge

WebSocket 调试台：实时收发、子协议协商、模板变量与心跳保活，外加 RFC 6455 帧开销计算、1000–4999 全量关闭码释义、指数退避重连规划与连接配置体检，断线自愈全过程可见，离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/WebSocketForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
