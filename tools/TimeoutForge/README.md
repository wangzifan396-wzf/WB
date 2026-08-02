# TimeoutForge

超时预算规划器：按行录入调用链每一跳的超时、P99 延迟、重试次数与退避间隔，逐层核对是否存在下游超时大于上游的倒挂，计算最坏耗时与重试放大倍数，自顶向下分配超时预算，并按 P99 反推推荐超时值，同时给出 Google SRE 重试预算与对冲请求建议。治理级联超时、防重试风暴，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/TimeoutForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
