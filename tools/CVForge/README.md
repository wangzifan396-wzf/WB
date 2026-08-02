# CVForge

离线简历 / CV 工作台 —— 单文件 · 零依赖 · 本地优先。

左侧表单填好姓名、职位、简介、联系方式、工作经历、教育、技能与项目，右侧实时预览三种排版模板（Modern / Classic / Compact）。一键「打印 / 导出 PDF」即可生成干净的中文简历；也能把数据导出 / 导入 JSON，全部存在浏览器本地。所有处理都在本地完成，不联网、不上传、不引任何第三方库。

## 功能

- 结构化表单：基本信息、联系方式、工作经历（含要点）、教育、技能、项目、链接
- 实时预览，三种模板一键切换
- 完整度进度条，提醒你补齐关键板块
- 打印 / 导出 PDF（用浏览器打印，模板样式即所见）
- 导出 / 导入 JSON，方便备份与跨设备迁移
- 本地自动保存（localStorage）

## 用法

直接双击 `index.html` 在浏览器打开即可；或部署到任意静态托管（GitHub Pages 已开启）。导出 PDF 时用浏览器打印对话框的「另存为 PDF」。

## 纯函数（可在 Node 下单测）

`defaultData` / `completeness` / `renderCV` / `toJSON` / `fromJSON` / `escapeHTML` / `escapeAttr` / `slugify` —— 见 `_test.js`。

## 开发

```bash
python build.py      # index.html -> index.html (identity)
node _test.js        # 纯函数断言
node smoke.js        # DOM 冒烟（需 jsdom）
```

## 协议

MIT · [nano-tools](https://github.com/wangzifan396-wzf)

> 由 nano-tools 自动发布，详情见门户 [WB](https://wangzifan396-wzf.github.io/WB/)。
