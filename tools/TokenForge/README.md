# TokenForge

LLM Token 估算器与成本计算器 —— 单文件、零依赖、本地优先。2026 年 AI 编码代理时代，token 预算是核心成本杠杆（参考 OmniRoute、Caveman、context-mode 等热门项目的 token 优化方向）。

- `countTokens(text)`：确定性 GPT 风格子词近似分词（小写 + 4 字符分块 + 标点/空白独立成 token），可复现、可测试。
- `estimateCost(text, model)`：基于内置单价表（gpt-4o-mini / gpt-4o / claude-3.5-sonnet / deepseek-chat / gemini-1.5-pro）估算输入/输出成本。
- `breakdown(text)`：返回字符数、词数、估算 token 数。

## 测试
```
node _test.js
node smoke.js
```
