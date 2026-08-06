# YahtzeeForge

快艇骰子（Yahtzee）：掷 5 颗骰子，每回合最多重掷 3 次（可保留任意骰子），再选一个记分格锁定——包含一到六、三条、四条、葫芦、小顺、大顺、快艇（五同）、机会共 13 项。内核纯函数计算每项得分并给出最佳建议，离线零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/YahtzeeForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
