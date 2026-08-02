# HabitForge · 习惯追踪器

> 单文件 / 零依赖 / 数据只存本地的习惯打卡工具。

**在线使用**：https://wangzifan396-wzf.github.io/WB/tools/HabitForge/

## 功能

- **每日打卡**：一键勾选/取消，Enter 快速添加习惯
- **连击统计**：当前连击（今天未打卡不清零，从昨天起算）+ 历史最长连击
- **完成率**：近 30 天完成率 + 累计打卡次数
- **半年热力图**：26 周 × 7 天 GitHub 风格热力格，未来日期淡显
- **数据主权**：localStorage 本地持久化，JSON 一键导出/导入，不上传任何服务器

## 技术

- 纯函数内核 `HF`（日期序列换算 / 连击 / 完成率 / 热力图 / 序列化）与 UI 分离，`window.__HABITFORGE__` 暴露测试钩子
- 日期底座基于 Howard Hinnant days-from-civil 算法，跨月/跨年连击无 `Date` 时区陷阱
- 导入防御：过滤非法日期键、空名习惯、非本应用 JSON
- PWA：Service Worker 缓存，离线可用；零外部请求

## 本地测试

```bash
node _test.js   # 内核单测（55+ 断言）
node smoke.js   # jsdom UI 冒烟
```

## License

MIT
