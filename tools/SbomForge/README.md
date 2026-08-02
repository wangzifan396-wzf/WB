# SbomForge

SBOM 工具：粘贴依赖清单（npm/pip/yarn 锁文件或自定义列表），生成 CycloneDX 或 SPDX 格式的软件物料清单，标注组件名称/版本/PURL/许可证与依赖关系，并检测已知弱点模式。梳理供应链、满足合规与审计要求，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SbomForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
