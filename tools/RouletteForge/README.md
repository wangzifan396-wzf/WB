# RouletteForge

轮盘（Roulette，欧洲规则含 0）：先选一种下注（红 / 黑 / 偶 / 奇 / 三个 12 区间），再旋转，小球落点决定赔付——红黑奇偶 1 赔 1，区间 1 赔 2，直选数字 1 赔 35。带演示余额，纯前端离线。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/RouletteForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
