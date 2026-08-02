# NumeralForge

数字 ↔ 文字 转换工具 —— 单文件、零依赖、本地优先。

- `toEnglish(n)`：整数与小数转英文单词（支持负数、`point` 小数、千分位组名）。
- `toChineseCapital(n)`：**人民币大写金额**（壹贰叁… 元角分、整、负），支持两位小数。

## 示例
- `1234.56` → `one thousand two hundred thirty-four point five six` / `壹仟贰佰叁拾肆元伍角陆分`
- `-50` → `negative fifty` / `负伍拾元整`

## 测试
```
node _test.js
node smoke.js
```
