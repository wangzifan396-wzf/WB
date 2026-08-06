# CheckersForge

西洋跳棋（Checkers / English Draughts）：棋子斜向移动，跳过相邻敌方棋子即吃掉它，抵达底线升变为王（可双向走）。内置强制吃子规则与贪心 AI，你执红先手对战机器，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/CheckersForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
