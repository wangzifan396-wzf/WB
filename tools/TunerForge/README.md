# TunerForge

一个单文件、零依赖、本地优先的网页调音器。用麦克风采集声音，通过自相关算法估计基频，再对照十二平均律给出最近的音名、频率与音分偏差。

## 功能

- 实时麦克风调音：检测最近音名（如 `A4`）、频率（Hz）与音分偏差（`±¢`）。
- 调准指示：音分偏差在 `±5¢` 内视为已调准（绿色）。
- 可调参考音 A4：415–466 Hz（默认 440 Hz）。
- 离线优先：所有计算在浏览器本地完成，声音不上传。
- 无麦克风回退：手动输入频率试算，或播放参考音验证检测逻辑。
- 双语界面（中文 / English）。

## 算法

基频估计采用归一化自相关（autocorrelation），取「首个强局部最大值」作为基波周期（而非全局最大值，避免取到谐波倍频）。随后 `midi = 69 + 12·log2(f/A4)`，四舍五入得到最近音名与音分偏差。

## 本地运行

直接用浏览器打开 `index.html` 即可（建议通过本地服务器或 GitHub Pages 以提供麦克风权限所需的 HTTPS 上下文）。

## 测试

```bash
node _test.js     # 纯函数内核断言（自相关 / 音名 / 音分 / 频率换算）
node smoke.js     # jsdom 加载页面，校验 DOM 接线与 DSP 接线
```

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 单文件工具本体（内核 + UI + i18n + PWA） |
| `_test.js` | Node 单元测试 |
| `smoke.js` | jsdom 冒烟测试 |
| `sw.js` | Service Worker（同域命名空间 `nano:tunerforge`） |
| `manifest.webmanifest` | PWA 清单 |
| `favicon.svg` / `og.svg` | 图标与社交分享图 |

## 许可证

MIT © 2026 wangzifan396-wzf
