# RedactForge

文本脱敏（Redact）工具：一键遮蔽文本里的邮箱、手机号、银行卡号、IPv4 地址等敏感信息，保留可辨识的前缀或末四位，方便在截图、日志、演示中分享而不泄露隐私。纯本地处理，零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/RedactForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
