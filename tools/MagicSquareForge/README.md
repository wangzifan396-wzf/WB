# MagicSquareForge

幻方（Magic Square）：把 1 到 n² 排成方阵，使每行、每列、两条对角线的和都相等（幻和 = n(n²+1)/2）。支持奇数阶（暹罗法）、双偶数阶与单偶数阶（LUX 法），一键生成，数学与数列启蒙好工具，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/MagicSquareForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
