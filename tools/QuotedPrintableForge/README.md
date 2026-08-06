# QuotedPrintableForge

Quoted-Printable 编码 / 解码（RFC 2045）：把非 ASCII 与特殊字符编码成 =XX 形式，是电子邮件正文的标准编码之一。支持编码与解码，纯本地、零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/QuotedPrintableForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
