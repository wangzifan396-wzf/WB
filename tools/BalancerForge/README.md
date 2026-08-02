# BalancerForge

负载均衡实验台：定义后端节点与权重，对比平滑加权轮询（SWRR）、最少连接、P2C 二选一与一致性哈希环的分流结果，量化各节点命中分布与不均衡度，并模拟增删节点时一致性哈希的键迁移比例。选型网关分流算法、评估扩缩容抖动，零依赖、离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/BalancerForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
