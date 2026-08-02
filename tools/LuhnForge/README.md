# LuhnForge

离线 Luhn 校验（银行卡号）· 单文件 · 零依赖 · 本地优先。

## 功能
- Luhn 模 10 算法校验任意号码（银行卡 / IMEI 等）
- 卡组织识别：Visa / Mastercard / Amex / 银联 / Discover / JCB / Diners
- 补全校验位、4 位分组格式化

纯函数：`luhnValidate` / `luhnCheckDigit` / `cardBrand` / `formatCard` —— 见 `_test.js`。

> 仅本地计算，号码不会离开你的浏览器。
