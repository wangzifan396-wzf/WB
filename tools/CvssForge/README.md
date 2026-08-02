# CvssForge

CVSS 评分计算器：按 CVSS v3.1 / v4.0 指标（AV/AC/PR/UI/S/C/I/A 与 v4 新增的 MSI/CR 等）实时计算基础分、临时分与严重等级（无/低/中/高/严重），并生成可复用的向量串。评估漏洞优先级、撰写安全报告时一目了然，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/CvssForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
