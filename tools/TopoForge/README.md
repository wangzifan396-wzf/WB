# TopoForge

拓扑排序 / DAG 编排器 —— 单文件、零依赖、本地优先。Kahn 算法求依赖执行顺序 + 并行批次分层，理解 CI/CD 流水线、构建系统与工作流编排（Airflow / Dagster / GitHub Actions needs）的调度内核。

- `parseEdges(text)`：每行 `a -> b`（a 先于 b），返回 `{nodes, edges, error}`。
- `topoSort(nodes, edges)`：Kahn 算法，字典序稳定；有环时返回 `{order:null, cycle:[...]}`。
- `levels(nodes, edges)`：分层输出可并行执行的批次；有环返回 `null`。

## 测试
```
node _test.js
node smoke.js
```
