# KenKenForge

肯肯（KenKen）：在 N×N 方格内填 1..N，使每行每列不重复，且每个 cage（带颜色区域）内的数字经过左上角标注的运算（＋－×÷）后得到目标值。由拉丁方生成保证有解，提供检查与显示答案，逻辑训练利器，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/KenKenForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
