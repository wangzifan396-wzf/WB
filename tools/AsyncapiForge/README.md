# AsyncapiForge

AsyncAPI 校验器：粘贴 YAML 或 JSON 文档，自动识别 3.0 与 2.x 代际，校验 info/servers/channels/operations 必填项、地址风格与重复、send|receive 语义、消息载荷与 $ref 断引用，绘制服务与频道的发布订阅拓扑，并给出 2.x 升级 3.0 的逐项改写提示。评审事件驱动契约、排查消息通道配置，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/AsyncapiForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
