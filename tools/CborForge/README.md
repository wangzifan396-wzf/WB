# CborForge

CBOR（RFC 8949）编解码器：把十六进制字节串解码为可读的结构化值（数组、映射、字节串、文本、标签、布尔/空与浮点），也可把 JSON 值编码回 CBOR 十六进制。适合调试 CoAP、物联网与二进制协议载荷，纯 JS 实现、零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/CborForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
