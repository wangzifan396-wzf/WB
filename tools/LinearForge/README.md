# LinearForge

线性回归拟合器 —— 单文件、零依赖、本地优先。最小二乘（OLS）一元线性回归：斜率 / 截距 / R² / 相关系数 r / RMSE / 残差 / 预测，粘贴数据即得趋势线。

- `linFit(pts)` → `{slope, intercept, r2, r, n}`，x 全同 / 点数不足返回 error。
- `linPredict(model, x)` / `linResiduals(model, pts)` / `linRmse(model, pts)`。
- `linParse(text)`：每行 `x,y`（逗号或 Tab 分隔）宽松解析。

## 测试
```
node _test.js
node smoke.js
```
