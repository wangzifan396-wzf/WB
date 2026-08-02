# TypingForge

**离线打字速度测试 — WPM / CPM / 准确率 / 一致性。单文件，零依赖，数据不出本机。**

Offline typing speed test with WPM / CPM / accuracy / consistency metrics. Single HTML file, zero dependencies.

**在线使用 / Live**: https://wangzifan396-wzf.github.io/WB/tools/TypingForge/

## 为什么 / Why

主流打字测试站点需要联网、有广告、有跟踪。TypingForge 是一个可以另存为的单 HTML 文件：

- **零依赖** — 无 npm、无 CDN、无外部请求，`file://` 直接打开即可用
- **隐私** — 成绩只存 localStorage，不上传
- **可复现** — 种子 RNG（mulberry32）生成词序，同种子同文本
- **PWA 离线** — 访问一次后断网可用

## 功能 / Features

- **模式** — 15 / 30 / 60 秒；常用英文词 / 编程关键词两套词表
- **实时** — 逐字符高亮（正确 / 错误 / 待输入 + 光标）、实时 WPM 与准确率
- **指标** —
  - 净 WPM：`(正确字符/5) / 分钟`（标准算法）
  - 毛 WPM、CPM
  - 原始准确率：按**曾经打错的每一次按键**计算（退格改对不洗白）
  - 一致性：每秒 WPM 序列的变异系数 → `100 - CV`
  - 评级 S/A/B/C/D/E
- **速度曲线** — 每秒 WPM 的 SVG sparkline
- **键盘** — `Tab` 随时重开；本机最佳成绩与次数记录

## 内核 API / Kernel

页面顶部 `<script>` 即内核（见 `_test.js` 抽取方式）：

```js
TF.makeRng(seed)              // mulberry32, [0,1)
TF.genText(50, seed, 'code')  // 可复现词表
TF.diffChars(target, typed)   // [{ch, state}] 逐字符状态
TF.wpm(correctChars, ms)      // 净 WPM
TF.consistency([60,58,62])    // 一致性 %
const s = TF.newSession(text, 15000);
TF.sessionInput(s, typed, Date.now());  // 状态机：首键计时/按键与错误统计/完成检测
TF.sessionTick(s, Date.now());          // 每秒采样 + 到时结束
TF.sessionResult(s);          // {netWpm, grossWpm, cpm, rawAccuracy, consistency, series...}
TF.sparkPath(series, 600, 72) // SVG path
```

## 测试 / Tests

```bash
node _test.js   # 63 kernel assertions（RNG/词表/diff/指标/状态机/曲线/评级）
node smoke.js   # jsdom full-page smoke（模拟真实打字流程，需 jsdom）
```

## 相关 / Related

本工具属于 [nano-tools](https://wangzifan396-wzf.github.io/WB/) 矩阵 — 每个工具一个独立仓库、一个 HTML 文件、零依赖。

## License

MIT
