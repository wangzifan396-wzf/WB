# AudioForge

本地优先的 **音频编辑器** —— 加载音频、波形预览、裁剪、增益、淡入淡出、归一化、反转，导出 WAV。文件 **零上传、离线可用**。nano-tools 矩阵第 14 旗舰。

## 功能

- **加载**：拖入或选择本地音频（MP3 / WAV / OGG / M4A / FLAC），或用内置「载入示例音」离线体验。
- **波形与播放**：Canvas 实时绘制波形；播放 / 停止；在波形上单击设置播放头、拖拽框选裁剪区间。
- **处理**：增益（−12 ~ +12 dB）、淡入 / 淡出（秒）、归一化（峰值 ≈ −1 dBFS）、反转播放顺序、导出采样率切换（44.1k / 48k / 22.05k）。
- **裁剪**：框选区间后一键 `应用裁剪`。
- **导出**：一键导出 **WAV（16-bit PCM）**，文件名自动沿用。

## 技术

- 纯前端、单文件、零第三方库。
- 解码用浏览器原生 `AudioContext.decodeAudioData`；处理与编码为纯函数，可在 Node 下单测。
- 导出采样率切换用线性重采样。

## 纯函数 API（可被 `_test.js` 抽取验证）

| 函数 | 说明 |
| --- | --- |
| `clamp(v,min,max)` | 区间截断 |
| `formatBytes(n)` | 字节可读化 |
| `computePeaks(data, buckets)` | 通道数据降采样为波形峰值 |
| `applyGainToChannel(data, gainLinear)` | 增益 |
| `applyFadeToChannel(data, type, fadeSamples)` | 线性淡入 / 淡出 |
| `normalizeChannel(data, target)` | 归一化到目标峰值 |
| `reverseChannel(data)` | 反转顺序 |
| `resampleChannel(data, fromRate, toRate)` | 线性重采样 |
| `encodeWAVFromChannels(channels, sampleRate)` | 多声道交织为 16-bit PCM WAV `Uint8Array` |

## 开发

```bash
python build.py        # 由 template.html 生成 index.html（identity copy）
node _test.js          # 纯函数断言测试
node smoke.js          # jsdom 冒烟测试
```

## License

MIT · 属于 [nano-tools](https://github.com/wangzifan396-wzf) 开源矩阵。
