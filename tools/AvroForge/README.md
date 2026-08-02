# AvroForge

Avro 工具：解析 Avro 模式（record/enum/union/逻辑类型），计算解析规范形式（PCF）与 64 位 Rabin 指纹，编码/解码单对象（single-object）与二进制容器，并评估模式演进兼容性（FULL/BACKWARD/FORWARD）。调试 Kafka/数据流水线中的 Avro 载荷，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/AvroForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
