# JsonPathForge · JSONPath 查询测试器

> 单文件 · 零依赖 · 离线可用的 JSONPath 实时求值器（Goessner 语义）

**在线使用**: https://wangzifan396-wzf.github.io/WB/tools/JsonPathForge/

## 特性

- **自研递归下降内核**：`tokenize → parse → exec` 三段式，无任何第三方依赖
- **完整语法支持**：
  - `$` 根、`.name` / `['name']` 子属性、`..name` 递归下降
  - `*` / `[*]` / `..*` 通配
  - `[n]` / `[-n]` 下标（负数从尾部计）、`[0,2]` / `['a','b']` 联合
  - `[start:end:step]` Python 语义切片（支持负 step 逆序）
  - `[?(@.x)]` 存在性过滤、`[?(@.x op v)]` 比较（`== != < <= > >=`）
  - `[?(@.x =~ /re/i)]` 正则匹配、`&& ||` 逻辑组合（支持括号）
  - `[?(@ > 3)]` 标量元素直接比较、`$..[?(...)]` 全树过滤
- **规范化路径输出**：每条命中同时给出 `$['store']['book'][0]['title']` 形式的绝对路径
- **实时求值**：Enter 触发、示例 chip 一键填充、耗时统计、结果 JSON 一键复制
- 离线 PWA（Service Worker 缓存）、localStorage 记忆上次输入、`prefers-reduced-motion` 适配

## 本地使用

下载 `index.html` 双击打开即可，无需构建、无需网络。

## 测试

```bash
node _test.js   # 内核单测（56 断言）
node smoke.js   # jsdom UI 冒烟（需 jsdom）
```

## 内核 API

页面暴露 `window.__JSONPATHFORGE__`（Node 环境 `module.exports`）：

```js
JP.query(obj, '$..book[?(@.price < 10)].title')  // → 值数组
JP.run(obj, path)       // → [{ path: "$['store']…", value }]
JP.tokenize(path)       // → token 数组
JP.normalize(pathArr)   // → 规范化路径字符串
```

## 相关项目

nano-tools 系列 · [全部工具](https://wangzifan396-wzf.github.io/WB/)

## License

MIT
