# WordleForge

离线 Wordle 猜词游戏。内置 40 词离线词库，标准两遍扫描判定算法——先标绿再按剩余计数标黄，正确处理重复字母的所有边界情况，6 次机会，键盘状态按最高等级着色。

## 特性
- `wdScore(guess, answer)` 两遍扫描判定（绿/黄/灰，重复字母精确计数）
- `wdKeyStates` 键盘着色聚合（b<y<g 等级只升不降）
- `wdPick` 种子选词、`wdValid` 输入校验；纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
