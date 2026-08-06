# OldMaidForge

老处女（Old Maid）纸牌游戏：发牌后自动弃掉所有对子，轮流从对方抽牌、再弃对子，最后拿着孤张 Q 的人输。内置发牌、配对、抽牌逻辑，纯本地、零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/OldMaidForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
