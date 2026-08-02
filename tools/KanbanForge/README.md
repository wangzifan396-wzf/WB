# KanbanForge

> 离线看板 · 单文件 · 零依赖 · 本地优先任务管理

**在线使用：https://wangzifan396-wzf.github.io/WB/tools/KanbanForge/**

![tests](https://github.com/wangzifan396-wzf/WB/tree/main/tools/KanbanForge/actions/workflows/test.yml/badge.svg)

## 功能

- **多列看板**：添加 / 重命名 / 删除列，颜色自动分配
- **卡片管理**：双击编辑标题、描述、优先级（高/中/低）、标签
- **拖拽移动**：HTML5 原生拖拽，跨列移动 + 精确插入位置
- **搜索筛选**：关键词全文搜索，`#标签` 语法按标签过滤
- **导出**：Markdown（任务清单格式）/ JSON（完整备份）
- **导入**：JSON 一键恢复，带格式校验
- **本地存储**：localStorage 自动保存，数据永不离机

## 为什么

Trello 要账号，Notion 要网络。KanbanForge 是一个 HTML 文件——下载即用，断网可用，
数据只存在你自己的浏览器里。

## 技术

- 原生 JavaScript，零第三方库，零网络请求
- 纯函数数据层（`window.KanbanForgePure`）与 UI 层分离，可独立测试
- `_test.js` 29 断言 + `smoke.js` 9 项 DOM 冒烟检查

## 本地开发

```bash
node _test.js        # 纯函数单测
node smoke.js        # jsdom 冒烟测试（需 jsdom）
```

## License

MIT

---

nano-tools 矩阵成员 · [全部工具](https://github.com/wangzifan396-wzf/WB)
