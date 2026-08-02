# DateForge · 日期计算器

> 单文件 / 零依赖 / 离线可用的日期计算工具。

**在线使用**：https://wangzifan396-wzf.github.io/WB/tools/DateForge/

## 功能

- **日期间隔**：相差天数 / Y-M-D 分解 / 周数 / 工作日（周一~周五，含两端）
- **日期加减**：± 天 / 月 / 年，跨月自动收敛（1/31 + 1月 = 2/28 或 2/29）
- **日期信息**：星期 / ISO 8601 周数 / 年内第几天 / 闰年判断 / 当月天数 / Unix 时间戳
- **年龄计算**：精确到天的年龄 + 下次生日倒计时（闰日出生自动收敛）

## 技术

- 内核基于 Howard Hinnant days-from-civil 算法（纯整数日期序列换算，无 `Date` 时区陷阱）
- 纯函数内核 `DF` 与 UI 分离，`window.__DATEFORGE__` 暴露测试钩子
- PWA：Service Worker 缓存，离线可用；系统字体栈，零外部请求

## 本地测试

```bash
node _test.js   # 内核单测（60+ 断言）
node smoke.js   # jsdom UI 冒烟
```

## License

MIT
