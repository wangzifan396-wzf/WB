# LightsForge

关灯谜题（Lights Out）：5×5 网格，点击任一格会翻转它自身与上下左右相邻格的亮灭状态；目标是把所有灯熄灭（或点亮）。带打乱与生解思路启发，纯前端离线。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/LightsForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
