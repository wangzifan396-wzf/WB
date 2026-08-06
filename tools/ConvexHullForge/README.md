# ConvexHullForge

凸包可视化（Convex Hull）：在画布上随机撒点或自定坐标，用 Graham 扫描算法求出最外侧的包围多边形并高亮，附顶点数与周长。计算几何与算法教学的直观演示，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/ConvexHullForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
