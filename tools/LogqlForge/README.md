# LogqlForge

LogQL 工作台：解析并解释 Loki 查询，拆解日志流选择器、标签过滤、管线（| line_format / | json / | label_format）与指标查询（rate/sum by），也可通过表单可视化拼装查询。排查日志告警、学习 LogQL 的利器，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/LogqlForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
