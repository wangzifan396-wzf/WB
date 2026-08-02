# MetronomeForge

节拍器。BPM 30–260，4/4、3/4、2/4、6/8 拍号带强弱拍，WebAudio 前瞻调度（lookahead scheduling）保证毫秒级精准发声，Tap Tempo 敲击测速，视觉节拍灯同步。

## 特性
- `mtSchedule` 前瞻调度内核（纯函数，可断言调度窗口）
- `mtAccent` 强/中/弱拍判定（6/8 复拍子中强拍）、`mtFreq` 音高映射
- `mtTap` 滑动窗口平均敲击测速（异常间隔过滤）
- 纯前端、零依赖、离线（无音频环境时逻辑仍可用）

## 测试
```
node _test.js && node smoke.js
```
