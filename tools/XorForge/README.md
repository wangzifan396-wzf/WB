# XorForge

重复密钥 XOR 加解密：以循环复用的密钥对字节做异或，对称可逆，适合轻量混淆而非安全加密。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/XorForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
