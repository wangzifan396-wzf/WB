# ZerowidthForge

零宽字符隐写（Zero-width steganography）：把任意文本编码进 U+200B / U+200C / U+200D 等零宽字符，肉眼完全看不见地藏进一段普通文字里，可用于水印或低调传递信息。编码解码全在本地，零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/ZerowidthForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
