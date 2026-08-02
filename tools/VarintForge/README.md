# VarintForge

protobuf varint / ZigZag 编解码器 —— 单文件、零依赖、本地优先。Protocol Buffers、WebAssembly LEB128 同款变长整数编码，调试二进制协议的手边工具。

- `viEncode(n)`：无符号 varint（7 bit + 延续位），支持到 `Number.MAX_SAFE_INTEGER`（用除法而非位移避免 32 位截断）。
- `viZigzagEncode/Decode(n)`：有符号映射 `(n << 1) ^ (n >> 63)` 的语义等价实现（`-1→1, 1→2`）。
- `viDecodeOne(bytes, offset)` / `viDecodeStream(bytes)`：单值 / 连续流解码，截断与溢出返回 `{error}`。
- hex 字节流互转辅助（`ac 02` ↔ 300）。

## 测试
```
node _test.js
node smoke.js
```
