# ShellForge

Shell 脚本静态检查：内置未加引号变量、反引号、cd 无兜底、危险 rm、$? 判断、read 缺 -r、未使用变量等 18 条高频缺陷规则，逐行给出行号、说明与修复建议。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/ShellForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
