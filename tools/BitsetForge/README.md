# BitsetForge

位集合（Bitset）—— 单文件、零依赖、本地优先。定长位数组，支持置位 / 清零 / 翻转 / 读取 / 位运算 / 汉明权重（popcount）。

- `bitsetCreate(n)`：按 32 位字分组存储。
- `bitsetSet / bitsetClear / bitsetFlip / bitsetGet`：越界抛 `BIT_OUT_OF_RANGE`。
- `bitsetOr / bitsetAnd / bitsetXor`：同尺寸位运算（`BITSET_SIZE_MISMATCH`）。
- `bitsetCount(bs)`：Brian Kernighan 法 popcount。

## 测试
```
node _test.js
node smoke.js
```
