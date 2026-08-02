# AstarForge

A* 网格寻路可视化 —— 单文件、零依赖、本地优先。游戏 AI / 路径规划面试最经典的启发式搜索，粘贴 ASCII 网格即可看最短路径与扩展节点数。

- `asParseGrid(text)`：`.` 可走 / `#` 墙 / `S` 起点 / `E` 终点，行宽校验 + 多起点/非法字符报错。
- `asFindPath(parsed)`：A* + 曼哈顿启发（可采纳，保证最优），四方向单位代价，返回 `{path, cost, expanded}`。
- `asRender(parsed, path)`：路径以 `*` 叠加回网格，直观对比扩展效率。
- 无可达路径返回 `{error}`，不抛异常。

## 测试
```
node _test.js
node smoke.js
```
