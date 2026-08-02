# FuzzyForge

模糊匹配打分器 —— 单文件、零依赖、本地优先。fzf / VS Code Ctrl+P 风格的子序列模糊匹配：连续命中加分、词首 / 路径边界加分、跨度惩罚，输出可排序的匹配得分与命中位置。

- `fuzzyMatch(query, str)`：返回 `{matched, score, positions}`；大小写不敏感，空查询匹配一切。
- `fuzzyFilter(query, list)`：过滤 + 按分数降序（同分短串优先）。
- 加分规则：连续 +4、串首 +6、`/-_. ` 边界后 +5、camelCase 驼峰界 +4；跨度与起始偏移做线性惩罚。

## 测试
```
node _test.js
node smoke.js
```
