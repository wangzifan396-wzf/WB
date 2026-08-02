# JwkForge

JWK / JWKS 工坊：手写实现 JWK 与 JWKS 的解析、规范化与 RFC 7638 指纹，识别 Ed25519 / X25519 / P-256·384·521 / RSA / OKP 等密钥类型，并把 JWK 与 PEM（SPKI 公钥、PKCS#8 私钥）及 DER hex 双向转换，PEM 的 ASN.1 DER 完全在本机手写编解码，离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/JwkForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
