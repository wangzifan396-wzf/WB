# TerraformForge

Terraform/HCL 辅助台：解析与格式化 Terraform 配置，校验 provider/resource/variable 引用一致性，展开 module 调用与 count/for_each，统计资源数与 provider 分布。调试 IaC、做变更前评审的好帮手，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/TerraformForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
