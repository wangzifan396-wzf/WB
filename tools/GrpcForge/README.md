# GrpcForge

gRPC 工具箱：查询全部 17 个状态码及其 HTTP 映射与可重试性，双向解析 grpc-timeout 头并推演多跳截止时间传播预算，把十六进制载荷拆成长度前缀帧并按 protobuf 线格式列出字段编号与类型，还能体检 retryPolicy 的退避配置与重试放大倍数。调试 gRPC 调用链、设计重试策略，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/GrpcForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
