# GraphemeForge

Unicode 字素计数：用 Intl.Segmenter（带回退）把一个 emoji、组合重音字符（如 á）或 ZWJ 序列（如 👨‍👩‍👧‍👦、🇨🇳）正确计为 1 个字素，避免按码点误数。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/GraphemeForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
