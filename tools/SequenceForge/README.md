# SequenceForge

时序图生成器 —— 单文件、零依赖、本地优先。mermaid 风格极简 DSL，接口联调 / 架构评审 / 故障复盘随手画时序图。

- DSL：`A->B: 消息` 实线请求，`A-->B: 消息` 虚线回包，`A->A: 消息` 自环，`#` 行注释。
- `sqParse(text)`：按出场顺序收集参与者，逐行解析并精确报错行号。
- `sqLayout(model)`：等宽泳道 + 逐行下压排列，自环折线布局。
- `sqSvg(text)`：暗色 SVG，箭头 marker、虚线样式、XML 转义防注入。

## 测试
```
node _test.js
node smoke.js
```
