# AhoForge

Aho-Corasick 多模式匹配 —— 单文件、零依赖、本地优先。一次扫描同时匹配多个模式串（含重叠），用于入侵检测、敏感词过滤、DNA 序列与日志检索（Snort / ClamAV / 搜广推召回底层即用）。

- `ahoBuild(patterns)` → 自动机（Trie + 失败指针 + 输出函数）。
- `ahoFind(text, root)` → 命中列表 `[{pattern, index}]`，支持重叠与重复模式。
- 纯函数，结果可断言。

## 测试
```
node _test.js
node smoke.js
```
