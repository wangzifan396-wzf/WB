# OtpForge

一次性口令（OTP）生成器：粘贴 Base32 密钥或标准 otpauth:// URI，按 RFC 6238（TOTP）或 RFC 4226（HOTP）生成当前动态码，显示秒级倒计时与 ±1 周期时钟容错窗口，支持自定义位数与周期。可用于验证 Authenticator 配置、调试 2FA 集成，纯 JS 同步实现、零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/OtpForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
