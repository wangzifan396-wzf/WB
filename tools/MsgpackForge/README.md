# MsgpackForge

MessagePack 编解码器 —— 单文件、零依赖、本地优先。将 JSON 值编码为紧凑二进制（hex 展示），并可无损还原；覆盖 MessagePack 规范的 JSON 子集。

- `mpEncode(value)` → 字节数组：nil/bool/fixint/uint8-32/int8-32/float64/fixstr/str8-16/fixarray/array16/fixmap/map16。
- `mpDecode(bytes)` → 还原 JS 值；截断与尾随字节抛错。
- `mpToHex` / `mpFromHex`：hex 与字节互转。

## 测试
```
node _test.js
node smoke.js
```
