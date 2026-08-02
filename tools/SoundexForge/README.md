# SoundexForge

Soundex + Metaphone 语音相似匹配 —— 单文件、零依赖、本地优先。人名纠错 / 模糊检索 / 数据清洗的经典算法：拼写不同、读音相近的词归入同一编码。

- `sxSoundex(word)`：美国人口普查标准实现（首字母 + 三位数字），H/W 透明规则齐全；Knuth 向量 `Ashcraft→A261`、`Tymczak→T522`、`Pfister→P236` 全过。
- `sxMetaphone(word)`：Metaphone 简化版（PH→F、TH→0、KN- 削音、C/G 软硬音分流），比 Soundex 更细。
- `sxGroup(words, algo)`：批量分组，同音异拼一眼可见。
- `sxMatch(query, words, algo)`：`Smithe` 能同时命中 `Smith` 与 `Smyth`。

## 测试
```
node _test.js
node smoke.js
```
