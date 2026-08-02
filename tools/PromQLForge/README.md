# PromqlForge

PromQL 工具：粘贴一段 Prometheus 查询，自动拆解指标名、标签匹配器、范围向量（如 [5m]）、offset 与聚合（sum by ...）等子句并逐条解释；也可用表单选择函数（rate/irate/increase…）、聚合、标签过滤、范围与 offset，可视化拼装出正确的 PromQL。排查监控告警、学习 PromQL 的好帮手，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/PromqlForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
