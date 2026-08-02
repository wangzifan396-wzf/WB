# QueueForge

排队论容量计算器：输入到达率、服务时间与并发工作单元数，用 M/M/1、M/M/c、Erlang B/Erlang C 模型算出利用率、排队概率、平均等待与端到端延迟，并用通用扩展律（USL）拟合吞吐随并发增长的拐点。做容量规划、判断该加机器还是降延迟，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/QueueForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
