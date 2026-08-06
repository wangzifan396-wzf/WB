# PokerForge

德州扑克牌型评估：给定 2 张底牌 + 5 张公共牌（共 7 张），枚举全部 21 种 5 张组合，判定最强牌型（同花顺＞四条＞葫芦＞同花＞顺子＞三条＞两对＞一对＞高牌）并展示最佳五张。带一键发牌演示，纯逻辑内核可断言，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/PokerForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
