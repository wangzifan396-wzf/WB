# MatrixForge

线性代数计算器 —— 单文件、零依赖、本地优先。支持矩阵加法、乘法、转置、行列式与逆矩阵（2×2 闭式 + 高阶余子式/伴随矩阵），用于图形变换、数据降维与求解线性方程组（PyTorch / NumPy / 机器学习底层基石）。

- `matAdd` / `matMul` / `matTrans`：基础运算（维度不匹配抛 `DIM`）。
- `matDet(m)`：行列式（递归余子式展开）。
- `matInv(m)`：逆矩阵（奇异矩阵抛 `SINGULAR`）。
- 纯函数，结果可断言。

## 测试
```
node _test.js
node smoke.js
```
