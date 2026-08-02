# PemForge

PEM / X.509 检查器：内置 ASN.1 DER 编解码器，解析证书、CSR 与 RSA/EC 私钥，展示 ASN.1 结构树与字节偏移并规范化重编码，附 SHA-1/弱 RSA/有效期/398 天/SAN/v1 等体检，数据不出本机。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/PemForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
