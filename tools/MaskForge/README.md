# MaskForge

敏感信息脱敏（Mask）：把文本里的邮箱、手机号、银行卡号、身份证号一键打码（保留少量首尾字符），全部在浏览器本地完成，绝不把原文上传任何服务器。分享截图、日志、假数据前先脱敏，隐私保护随手可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/MaskForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
