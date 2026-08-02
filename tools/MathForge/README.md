# MathForge

离线数学表达式求值器 · 单文件 · 零依赖 · 本地优先。

## 功能
- 安全求值（**不使用 eval**）：tokenizer → 调度场算法 → 逆波兰求值
- 运算符 `+ - * / % ^`（幂右结合）、括号、一元负号
- 函数 `sqrt sin cos tan asin acos atan sinh cosh tanh abs floor ceil round trunc exp log ln log10 log2 sign pow min max`
- 常量 `pi e tau phi`

纯函数：`evaluate` / `tokenize` / `toRPN` / `evalRPN` / `fmt` —— 见 `_test.js`。
