# StateForge

有限状态机工作台 —— 单文件、零依赖、本地优先。用三列 CSV（from,event,to）定义状态机，静态分析 + 事件推演一步到位，审批流 / 订单流 / 协议状态设计的草稿纸。

- `fsmParse(text)`：`*` 前缀标终态，首行 from 即初始态；同状态同事件指向不同目标（非确定）直接报错。
- `fsmReachable(fsm)`：BFS 求初始态可达集，揪出画了却到不了的孤儿状态。
- `fsmDeadStates(fsm)`：反向不动点求「到不了任何终态」的死状态——流程卡死的根源。
- `fsmRun(fsm, events)`：事件序列推演，输出完整路径与是否停在终态；非法事件提示当前可用事件。

## 测试
```
node _test.js
node smoke.js
```
