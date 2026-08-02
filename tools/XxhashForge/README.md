# XxhashForge

xxHash32 极速哈希 —— 单文件、零依赖、本地优先。非加密哈希的事实标准（LZ4 / zstd / RocksDB / 内容指纹都在用），4 累加器条带 + 雪崩混淆，纯 32 位整数运算实现。

- `xxhash32(text, seed)` / `xxhash32Hex(text, seed)`：UTF-8 输入，uint32 输出。
- `xxhash32Bytes(bytes, seed)`：字节级 API。
- 通过官方已知向量断言：`xxh32("") = 0x02CC5D05`、`xxh32("abc") = 0x32D153FF` 等。

## 测试
```
node _test.js
node smoke.js
```
