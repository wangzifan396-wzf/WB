<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/tools/CronText/"><img src="https://img.shields.io/github/stars/wangzifan396-wzf/CronText?style=flat-square&color=5E6AD2" alt="Stars"></a>
  <img src="https://img.shields.io/github/forks/wangzifan396-wzf/CronText?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/github/issues/wangzifan396-wzf/CronText?style=flat-square" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/wangzifan396-wzf/CronText?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/built%20with-HTML5%20%2B%20Vanilla%20JS-5E6AD2?style=flat-square" alt="HTML5">
  <img src="https://img.shields.io/badge/dependencies-zero-2EA043?style=flat-square" alt="Zero Dep">
  <img src="https://img.shields.io/github/license/wangzifan396-wzf/CronText?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/actions/workflow/status/wangzifan396-wzf/CronText/test.yml?style=flat-square" alt="CI">
</p>

<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/tools/CronText/"><strong>🌐 在线试用 Live Demo</strong></a>
</p>
<p align="center"><img src="og.svg" alt="nano-tools 预览" width="720"></p>

---

# CronText · Cron 表达式解释器

把晦涩的 crontab 表达式翻译成一句人话，并预测接下来几次的运行时间。单文件、零依赖、纯本地运行。

## ✨ 功能

- **人话描述** — 输入 `*/5 9-17 * * 1-5`，立刻得到「工作日 9-17 时的每 5 分钟」这样的解释
- **字段拆解** — 分 / 时 / 日 / 月 / 周逐字段展示各自含义
- **运行时间预测** — 基于本机时区，列出接下来 8 次的具体触发时刻与相对时间
- **完整语法** — 支持 `*` `,` `-` `/`、月份/星期英文别名、`7` 归一为周日、dom 与 dow 的「或」语义
- **示例库** — 12 条常见 cron，点击即填
- **暗 / 亮主题**，偏好本地记忆

## 🚀 使用

直接下载 `index.html` 双击打开，或访问 [在线 Demo](https://wangzifan396-wzf.github.io/WB/tools/CronText/)。

## 🧪 测试

解析、描述、下次运行计算均为纯函数，可离线单测：

```bash
node _test.js
```

## 🛠 技术

标准 5 字段 crontab 语法 + Vanilla JS，无构建、无依赖。运行时间在本地按你的时区计算。

## 📄 License

MIT
