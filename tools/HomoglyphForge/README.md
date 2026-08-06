# HomoglyphForge

Unicode 同形字（Homoglyph）工具：把 ASCII 字母替换成视觉几乎相同、但码点不同的西里尔 / 亚美尼亚等字符，用于演示账号冒充与钓鱼风险，也能反向检测一段文本里藏了哪些同形字。纯本地、零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/HomoglyphForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
