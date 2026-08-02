# JwsForge

JWS 工作台：手写实现 RFC 7515 的紧凑与 JSON（general / flattened）序列化解析，支持 detached 载荷；用 JWK 验签 HS256/384/512、RS256/384/512、ES256/384/512（RSA-PSS 提示走浏览器端 WebCrypto），并用私钥 JWK 签发上述算法的紧凑 JWS，全部纯 JS 同步、不依赖 WebCrypto、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/JwsForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
