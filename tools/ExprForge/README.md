# ExprForge

安全表达式求值器 —— 单文件、零依赖、本地优先。不用 `eval` / `new Function`：自研分词器 + 调度场算法（Shunting-Yard）+ RPN 栈求值，可安全用于用户输入的公式（报表 / 配置 / 低代码）。

- `exprEval(src, vars)` → `{value,error}`：四则 + `%` + `^`（右结合）+ 一元负号 + 括号。
- 变量注入 `{x: 5}`；常量 `pi` / `e`；函数 `abs sqrt min max floor ceil round log exp sin cos tan`。
- 错误全部返回而非抛出：未定义变量 / 除零 / 括号不匹配 / 非法字符。

## 测试
```
node _test.js
node smoke.js
```
