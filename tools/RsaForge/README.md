# RsaForge

本地 RSA 密钥对生成、加密、解密、签名与验签：基于 Web Crypto（RSA-OAEP / RSASSA-PKCS1-v1_5），密钥以 JWK 形式展示，私钥永不离开本机。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/RsaForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
