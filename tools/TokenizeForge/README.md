# TokenizeForge

BPE 子词分词可视化。在自定义语料上训练字节对编码（Byte Pair Encoding）合并规则，对任意文本切分子词并以彩色 token 块展示——直观理解 LLM 分词器的工作原理。

## 特性
- 完整 BPE 训练循环：统计对频 → 取最高频对（平局按字典序，确定性）→ 全局合并
- 合并规则列表 + 子词着色可视化
- 纯前端、零依赖、离线

## 测试
```
node _test.js && node smoke.js
```
