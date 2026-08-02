# LicenseForge

开源许可证文件生成器

单文件 · 零依赖 · 本地优先的网页小工具。所有计算在浏览器本地完成，不联网、不上传、不引任何第三方库。

## 功能

- 输入文本，实时得到变换结果
- 一键复制、清空
- 离线可用，整页就是一个 `.html` 文件

## 用法

直接双击 `index.html` 在浏览器打开即可；或部署到任意静态托管（GitHub Pages 已开启）。

## 纯函数（可在 Node 下单测）

`reverseStr` / `countWords` / `slugify` —— 见 `_test.js`。

## 开发

```bash
python build.py      # template.html -> index.html
node _test.js        # 纯函数断言
node smoke.js        # DOM 冒烟（需 jsdom）
```

## 协议

MIT · [nano-tools](https://github.com/wangzifan396-wzf)
