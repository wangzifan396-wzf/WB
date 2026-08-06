# SolitaireForge

空当接龙（Klondike 纸牌）：七列牌堆中把牌按“异色 + 点数递减”叠放，把四种花色的 A 到 K 依次收进上方的四个基础堆。支持重新发牌、自动收牌、撤销，纯前端离线可玩。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SolitaireForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
