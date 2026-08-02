# DataUriForge

文件与 data: URI 双向转换：自实现 Base64 与百分号编码，按扩展名推断 MIME 类型，支持 UTF-8 文本与 charset 参数，可直接得到内联到 CSS/HTML 的字符串。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/DataUriForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
