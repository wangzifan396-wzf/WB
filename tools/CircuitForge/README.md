# CircuitForge

熔断器工作台：配置滑动窗口、错误率与慢调用阈值、最小调用数与半开探测量，逐条回放请求序列，推演 Closed/Open/HalfOpen 状态机的跳闸时刻与恢复过程，并给出参数体检与整改建议。设计 Resilience4j/Sentinel/Hystrix 风格熔断策略、复盘雪崩事故的利器，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/CircuitForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
