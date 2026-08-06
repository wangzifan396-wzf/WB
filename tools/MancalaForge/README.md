# MancalaForge

曼卡拉（Mancala / Kalah 播棋）：每一坑 4 粒种子，选一个坑把种子逆时针逐一播撒；若最后一粒落入自己的空坑且对面有子，则连对面一起收进大本营；落入本营可再走一次。终局仓库多者胜，你执下半排对战机器，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/MancalaForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
