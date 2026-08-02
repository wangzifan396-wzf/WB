<p align="center"><img src="og.svg" alt="nano-tools 预览" width="720">  <img src="https://img.shields.io/github/actions/workflow/status/wangzifan396-wzf/MockForge/test.yml?style=flat-square" alt="CI">
</p>
# MockForge

> 离线优先的假数据 / Mock 数据生成器 —— 自定义字段 schema，一键生成 JSON / CSV / SQL，数据不上传。

[![Stars](https://img.shields.io/github/stars/wangzifan396-wzf/MockForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MockForge/stargazers)
[![Forks](https://img.shields.io/github/forks/wangzifan396-wzf/MockForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MockForge/network/members)
[![Issues](https://img.shields.io/github/issues/wangzifan396-wzf/MockForge?style=flat&logo=github)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MockForge/issues)
[![Last Commit](https://img.shields.io/github/last-commit/wangzifan396-wzf/MockForge?style=flat)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MockForge/commits/main)
[![HTML5](https://img.shields.io/badge/HTML5-zero--dependency-5E6AD2?logo=html5&logoColor=white)](https://github.com/wangzifan396-wzf/WB/tree/main/tools/MockForge)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?logo=opensourceinitiative&logoColor=white)](LICENSE)

🌐 **在线试用：** https://wangzifan396-wzf.github.io/WB/tools/MockForge/

## 特性
- **零依赖、单文件**：只有 `index.html`，双击即用。
- **本地优先**：数据在浏览器内生成，不出本机。
- **自定义字段**：14 种字段类型（id / uuid / 姓名 / 邮箱 / 手机 / 数字 / 布尔 / 日期 / 城市 / 词句…）。
- **三格式导出**：JSON / CSV / SQL（`INSERT` 语句，自动转义与表名净化）。
- **可复现**：相同「种子」生成完全相同的一批数据，方便测试断言。
- **明暗主题**。

## 字段类型
`id`（自增）、`uuid`（v4）、`fullName`、`firstName`、`lastName`、`email`、`phone`、`int`、`float`、`bool`、`date`、`city`、`word`、`sentence`。

## 使用
在左侧编辑字段名与类型，设置条数、种子与目标格式，点「生成」即可复制或下载。

## 技术栈
纯 HTML + CSS + 原生 JS。内置确定性 PRNG（mulberry32），无任何第三方库。

## 测试
```bash
node _test.js   # 纯函数单测（PRNG / 生成 / 导出）+ jsdom 功能测试
```

## License
[MIT](LICENSE)
