# TrieForge

前缀树（Trie）—— 单文件、零依赖、本地优先。自动补全、词表检索、前缀统计的基础结构。

- `trieCreate()` / `trieInsert(trie, word)`：构建与插入。
- `trieContains(trie, word)` / `trieStartsWith(trie, prefix)`：精确与前缀判定。
- `trieCollect(trie, prefix)`：返回按字典序排列的前缀匹配单词。
- `trieDelete(trie, word)`：删除并清理空链（引用计数式）。

## 测试
```
node _test.js
node smoke.js
```
