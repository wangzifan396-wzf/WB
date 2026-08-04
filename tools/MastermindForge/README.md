# MastermindForge

猜码（Mastermind）：电脑生成一组 4 色密码（可重复），你每次提交猜测，系统反馈“位置颜色全对 ⚫”与“颜色对位置错 ⚪”的数量，靠逻辑推理在 10 步内破解。纯前端离线。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/MastermindForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
