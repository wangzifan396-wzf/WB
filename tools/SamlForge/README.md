# SamlForge

SAML 2.0 Response 解码器：粘贴 SAML Response 的 XML 原文或 base64 编码，解析 Issuer、NameID/Subject、Conditions 有效期（并校验当前是否在有效期内）、Audience 与所有属性声明（AttributeStatement），标注是否签名。帮助排查 SSO 登录问题，全部在浏览器内完成、不上传任何数据。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SamlForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
