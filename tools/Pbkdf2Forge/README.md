# Pbkdf2Forge

PBKDF2 密钥派生：用口令、盐与迭代次数派生指定长度的密钥（可用于 AES 加密或口令存储哈希），支持 HMAC-SHA-256 与 HMAC-SHA-1，给出迭代次数强度建议，全部纯 JS 同步实现、不依赖浏览器加密 API、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/Pbkdf2Forge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
