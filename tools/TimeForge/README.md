# TimeForge

> 时间戳转换 / 时区对照 / 日期计算 · 单文件 · 零依赖 · 全程离线

**在线使用：https://wangzifan396-wzf.github.io/WB/tools/TimeForge/**

![tests](https://github.com/wangzifan396-wzf/WB/tree/main/tools/TimeForge/actions/workflows/test.yml/badge.svg)

## 功能

- **时间戳 → 日期**：自动识别秒（10 位）/ 毫秒（13 位），6 时区同屏对照 + ISO 8601 + 星期
- **日期 → 时间戳**：按所选时区解释输入时间，同时输出秒级 / 毫秒级 / ISO
- **日期差计算**：天/时/分/秒拆解 + 累计总量 + 人性化时长（「1 天 1 小时」）
- **实时时钟**：当前 Unix 时间戳每秒刷新
- **闰年 / 月天数**：内置纯函数，边界（1900 / 2000）已验证

## 为什么

每个开发者每周都要查几次时间戳。在线工具要联网还带广告——TimeForge 是一个
HTML 文件，打开即用，断网可用。

## 技术

- 原生 JavaScript，零第三方库，零网络请求
- 纯函数层（`window.TimeForgePure`）用显式 UTC 偏移计算，不依赖运行环境时区，测试可复现
- `_test.js` 30 断言 + `smoke.js` 8 项 DOM 冒烟检查

## 本地开发

```bash
node _test.js        # 纯函数单测
node smoke.js        # jsdom 冒烟测试（需 jsdom）
```

## License

MIT

---

nano-tools 矩阵成员 · [全部工具](https://github.com/wangzifan396-wzf/WB)
