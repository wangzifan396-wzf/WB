# AvlForge

AVL 自平衡二叉搜索树 —— 单文件、零依赖、本地优先。四种旋转（LL/RR/LR/RL）逐步日志 + ASCII 树形渲染，数据结构课程与面试的可视化教具。

- `avlInsert(root, key, log)`：递归插入 + 平衡因子检测，触发旋转时写入日志（如 `LL@30 右旋`）。重复键返回 `{error}` 且树不变。
- `avlValidate(root)`：独立校验 BST 有序性 + 每节点平衡因子 |bf|≤1 + 高度缓存正确。
- `avlInorder(root)`：中序遍历（必为有序序列）。
- `avlRender(root)`：ASCII 树形图（右子树在上），每节点带高度。

## 测试
```
node _test.js
node smoke.js
```
