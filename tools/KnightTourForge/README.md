# KnightTourForge

骑士巡游（Knight's Tour）：让国际象棋的马从起点出发，按“日”字走法踏遍棋盘每一格且不重复。用 Warnsdorff 启发式加速回溯搜索，并在盘面上标出访问顺序，算法与回溯教学的经典案例，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/KnightTourForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
