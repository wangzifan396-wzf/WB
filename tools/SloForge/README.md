# SloForge

SLO 错误预算计算器：输入可用性目标（99.9% 或 three nines）与统计窗口，换算成允许的停机时长与失败请求数，按实际流量计算错误预算消耗比例、燃尽速率与预计耗尽时刻，并生成 Google SRE 多窗口多燃尽率（MWMBR）告警阈值表。做 SLO 评审、配置告警规则的利器，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SloForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
