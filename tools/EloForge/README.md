# EloForge

Elo 等级分推演器 —— 单文件、零依赖、本地优先。国际象棋 / 电竞天梯 / LLM Arena 排行榜同款算法，输入对局序列逐局推演分数变化。

- `eloExpect(ra, rb)`：期望胜率 `1/(1+10^((rb-ra)/400))`，400 分差 ≈ 10:1 胜率。
- `eloUpdate(ra, rb, score, k)`：单局更新（零和），爆冷获胜加分多、稳赢加分少；比分限 0 / 0.5 / 1。
- `eloSeries(ra, rb, scores, k)`：批量对局链式推演，输出每局期望、Δ 与轨迹。
- K 因子预设 32/24/16/10（新手 → 顶级），K 越小分数越稳。

## 测试
```
node _test.js
node smoke.js
```
