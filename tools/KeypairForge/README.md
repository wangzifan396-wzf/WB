# KeypairForge

密钥对工作台：浏览器内用 WebCrypto 生成 Ed25519 / X25519 / P-256·384·521 / RSA 2048·3072·4096 密钥对，自动切成 OpenSSH 公钥、PEM 公钥(SPKI)、PEM 私钥(PKCS#8)、JWK 公钥 / 私钥、DER hex 六种形态，算出 SSH / JWK(RFC 7638) / SPKI Pin / X.509 SKI 四套指纹，支持粘贴现有密钥解析、配对校验与逐算法 openssl / ssh-keygen 命令速查，离线可用、私钥不离开标签页。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/KeypairForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
