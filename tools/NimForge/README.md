# NimForge

尼姆（Nim）：若干堆石子，轮流从某一堆取走任意数量，取走最后一枚者胜。内置基于 Nim-sum（异或）的必胜策略 AI，并能在任何时候给出“该从哪堆取几枚”的提示，数学博弈论的经典小品，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/NimForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
