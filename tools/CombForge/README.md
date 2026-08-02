# CombForge

BigInt 组合数学计算器 —— 单文件、零依赖、本地优先。`C(1000,500)` 这类 300 位大数照算不误，概率题、抽奖期望、算法复杂度分析的手边工具。

- `cbNcr(n,r)`：乘除交替保证每步整除（帕斯卡恒等式性质），BigInt 无精度损失，`min(r, n-r)` 优化。
- `cbNpr(n,r)` / `cbFact(n)`：排列数与阶乘（`100!` 158 位精确值）。
- `cbCatalan(n)`：卡特兰数 `C(2n,n)/(n+1)`——合法括号序列 / 二叉树形态计数。
- `cbPascal(rows)`：帕斯卡三角前 50 行（行和恒为 2^n 自校验）。

## 测试
```
node _test.js
node smoke.js
```
