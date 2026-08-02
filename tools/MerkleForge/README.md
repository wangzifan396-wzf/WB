# MerkleForge

默克尔树构建与证明器 —— 单文件、零依赖、本地优先。SHA-256 默克尔树 + 包含性证明（Merkle Proof）+ 校验，理解区块链交易证明、Git 对象模型、软件供应链完整性（Sigstore / transparency log）的数据结构根基。

- `merkleRoot(leaves)`：叶子加 `leaf:` 前缀、内部节点加 `node:` 前缀（防第二原像攻击）；奇数层复制末节点。
- `merkleProof(leaves, i)`：O(log n) 兄弟哈希路径，标记左右方向。
- `merkleVerify(leafData, proof, root)`：沿路径重算即可验证，无需全量数据。

## 测试
```
node _test.js
node smoke.js
```
