<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/"><img src="https://img.shields.io/github/stars/wangzifan396-wzf/WB?style=flat-square&color=5E6AD2" alt="Stars"></a>
  <img src="https://img.shields.io/github/forks/wangzifan396-wzf/WB?style=flat-square" alt="Forks">
  <img src="https://img.shields.io/github/issues/wangzifan396-wzf/WB?style=flat-square" alt="Issues">
  <img src="https://img.shields.io/github/last-commit/wangzifan396-wzf/WB?style=flat-square" alt="Last Commit">
  <img src="https://img.shields.io/badge/tools-1010-5E6AD2?style=flat-square" alt="1010 Tools">
  <img src="https://img.shields.io/badge/dependencies-zero-2EA043?style=flat-square" alt="Zero Dep">
  <img src="https://img.shields.io/github/license/wangzifan396-wzf/WB?style=flat-square" alt="License">
</p>

<p align="center">
  <a href="https://wangzifan396-wzf.github.io/WB/"><strong>🌐 打开门户 Live Portal</strong></a>
</p>

---

# nano-tools · 单文件工具集

**1010 款单文件、零依赖、本地优先的开发者工具**，全部收在这一个仓库里（覆盖 22 个分类）。
每个工具就是一个 `index.html`——无需安装、无需构建、无需联网，下载即用，数据永远留在你的浏览器里。

## 为什么是 nano-tools

- **单文件**：每个工具就是一个 HTML 文件，右键另存即拥有全部源码。
- **零依赖**：无 npm、无构建、无 CDN、无遥测——审计成本趋近于零。
- **本地优先**：所有计算在你的浏览器内完成，数据永不上传。
- **一个仓库**：不用在几百个仓库之间跳转，clone 一次就拿到全部。

## 仓库结构

```
WB/
├── index.html          # 门户首页（工具检索 / 分类筛选）
├── tools/
│   ├── <ToolName>/
│   │   ├── index.html  # 工具本体，单文件、可直接双击打开
│   │   ├── README.md
│   │   ├── og.svg  favicon.svg  manifest.webmanifest  sw.js
│   └── ...             # 共 1010 个工具目录
└── sw.js  manifest.webmanifest  .nojekyll
```

每个工具的在线地址：`https://wangzifan396-wzf.github.io/WB/tools/<ToolName>/`

## 🧰 工具矩阵（精选展示 · 全库 1010 款 · ⭐ = 旗舰）

| 工具 | 分类 | 简介 |
| --- | --- | --- |
| [nano-workbench](https://wangzifan396-wzf.github.io/nano-workbench/) | 聚合器 | 统一工作台：一个标签页收纳全部工具，点选即在内嵌窗口运行、标签即时切换。 |
| [RegexLab](https://wangzifan396-wzf.github.io/WB/tools/RegexLab/) | 文本处理 | 正则表达式实时测试器：匹配高亮、捕获组、替换预览、14 组常用正则库与速查表。 |
| [CronText](https://wangzifan396-wzf.github.io/WB/tools/CronText/) | 开发辅助 | Cron 表达式翻译成人话，并预测未来 8 次运行时间；内置常见调度示例库。 |
| [DiffLens](https://wangzifan396-wzf.github.io/WB/tools/DiffLens/) | 文本处理 | 基于 LCS 的文本 / JSON 差异对比，并排与内联双视图，JSON 规范化后按结构比对。 |
| [ContextLens](https://wangzifan396-wzf.github.io/WB/tools/ContextLens/) | AI 工具 | LLM 上下文与成本可视化器：token 估算、多模型价格对比、上下文窗口占用分析。 |
| [BoxKit](https://wangzifan396-wzf.github.io/WB/tools/BoxKit/) | 开发辅助 | 19 合 1 离线开发者工具箱：JSON/YAML、Base64、哈希、时间戳、正则、颜色等一站搞定。 |
| [Inkwell](https://wangzifan396-wzf.github.io/WB/tools/Inkwell/) | 效率工具 | 本地优先 Markdown 知识库：双向链接、力导向关系图、实时预览，数据全存本地。 |
| [Graphite](https://wangzifan396-wzf.github.io/WB/tools/Graphite/) | 可视化 | SVG 可视化节点编辑器：拖拽连线、自动布局，导出 SVG / PNG / JSON / Markdown。 |
| [Chartify](https://wangzifan396-wzf.github.io/WB/tools/Chartify/) | 可视化 | CSV / JSON 秒变 SVG 图表：柱状、折线、饼图，可导出矢量图，纯前端渲染。 |
| [UniConvert](https://wangzifan396-wzf.github.io/WB/tools/UniConvert/) | 实用计算 | 12 类万能单位换算：长度、重量、温度、数据、时间、货币格式等，实时联动。 |
| [SnapCompress](https://wangzifan396-wzf.github.io/WB/tools/SnapCompress/) | 图像工具 | 纯 Canvas 图片压缩：JPEG/PNG/WebP、质量与最大宽度可调、压缩前后实时对比。 |
| [PalettePro](https://wangzifan396-wzf.github.io/WB/tools/PalettePro/) | 设计工具 | 颜色 / 配色工作台：WCAG 对比度检测、和谐配色生成、渐变构造、取色板管理。 |
| [HashKit](https://wangzifan396-wzf.github.io/WB/tools/HashKit/) | 编码加密 | 编码与哈希工具箱：Base64/URL/HTML 编解码、SHA 哈希、JWT 解码、UUID 与密码生成。 |
| [JsonForge](https://wangzifan396-wzf.github.io/WB/tools/JsonForge/) | 文本处理 | JSON 工作台：格式化 / 压缩 / 校验、转 TypeScript 类型、JSONPath 查询、树形浏览。 |
| [RESTKit](https://wangzifan396-wzf.github.io/WB/tools/RESTKit/) | 开发辅助 | 离线 REST 客户端：请求构建、查询参数 / 头 / Body、Bearer/Basic 鉴权、响应计时与历史记录。 |
| [DataForge](https://wangzifan396-wzf.github.io/WB/tools/DataForge/) | 文本处理 | JSON / CSV / TOML 三格式互转：嵌套表、数组表、标量数组均保留，实时转换、一键交换。 |
| [MarkForge](https://wangzifan396-wzf.github.io/WB/tools/MarkForge/) | 效率工具 | Markdown 实时编辑器：边写边预览、快捷工具栏、导出独立 HTML、中英文字数统计。 |
| [MockForge](https://wangzifan396-wzf.github.io/WB/tools/MockForge/) | 开发辅助 | 假数据 / Mock 生成器：14 种字段类型、可复现种子，一键导出 JSON / CSV / SQL。 |
| [CSSKit](https://wangzifan396-wzf.github.io/WB/tools/CSSKit/) | 设计工具 | CSS 游乐场：渐变、box-shadow、cubic-bezier 缓动曲线、Flex 布局，实时预览可复制。 |
| [SVGForge](https://wangzifan396-wzf.github.io/WB/tools/SVGForge/) | 图像工具 | SVG 压缩优化器：去元数据、精简小数、实时预览体积对比，转 Data URI / CSS background。 |
| [ColorForge](https://wangzifan396-wzf.github.io/WB/tools/ColorForge/) | 设计工具 | 颜色工作台：HEX/RGB/HSL 互转、和谐配色生成、WCAG 对比度检测与实时预览。 |
| [PassForge](https://wangzifan396-wzf.github.io/WB/tools/PassForge/) | 编码加密 | 密码 / 口令生成器：字符集与长度可调、Diceware 助记短语、熵值与强度评估。 |
| [IconForge](https://wangzifan396-wzf.github.io/WB/tools/IconForge/) | 设计工具 | 线性图标工作台：17 款描边图标、可调描边色/粗细/尺寸/填充，一键复制或下载 SVG。 |
| [CronForge](https://wangzifan396-wzf.github.io/WB/tools/CronForge/) ⭐ | 开发辅助 | Crontab 可视化：表达式解析成人话、预测未来 5 次运行、24 小时 + 7 天时刻表。 |
| [SnowflakeForge](https://wangzifan396-wzf.github.io/WB/tools/SnowflakeForge/) ⭐ | 开发辅助 | Snowflake ID 工作台：BigInt 按 41 位时间戳 + 10 位机器 + 12 位序列拆解与合成，自定义 epoch 与数据中心位。 |
| [PunyForge](https://wangzifan396-wzf.github.io/WB/tools/PunyForge/) ⭐ | 编码加密 | Punycode/IDN 转换：RFC 3492 编解码，中文等 Unicode 域名 ↔ xn-- ASCII 互转，逐标签处理。 |
| [ChangelogForge](https://wangzifan396-wzf.github.io/WB/tools/ChangelogForge/) ⭐ | 开发辅助 | Conventional Commits 解析：提交信息分组生成 CHANGELOG，breaking/feat/fix 自动推断下一个 SemVer 版本。 |
| [ULIDForge](https://wangzifan396-wzf.github.io/WB/tools/ULIDForge/) ⭐ | 编码加密 | ULID 生成与解码：Crockford Base32，48 位毫秒时间戳 + 80 位随机，可排序、可校验、可反解时间。 |
| [PasswordForge](https://wangzifan396-wzf.github.io/WB/tools/PasswordForge/) ⭐ | 安全工具 | 安全口令生成器：可配字符集、避开易混字符（Il1O0o）、每类至少含一个，实时熵估计。 |
| [NumeralForge](https://wangzifan396-wzf.github.io/WB/tools/NumeralForge/) ⭐ | 实用计算 | 数字转英文单词与人民币大写金额，支持负数与小数。 |
| [SparkForge](https://wangzifan396-wzf.github.io/WB/tools/SparkForge/) ⭐ | 可视化 | 数据序列一键生成 SVG 迷你折线图与柱状图，纯函数返回 SVG 字符串。 |
| [FigletForge](https://wangzifan396-wzf.github.io/WB/tools/FigletForge/) ⭐ | 文本处理 | 文本转 ASCII 方块艺术字，内置字体、可自定义填充字符与间距。 |
| [HtmlEntityForge](https://wangzifan396-wzf.github.io/WB/tools/HtmlEntityForge/) ⭐ | 编码加密 | HTML 实体编解码：命名/十进制/十六进制，XSS 安全转义。 |
| [UtmForge](https://wangzifan396-wzf.github.io/WB/tools/UtmForge/) ⭐ | 开发辅助 | UTM 参数构建、解析与校验，增长营销溯源。 |
| [InterestForge](https://wangzifan396-wzf.github.io/WB/tools/InterestForge/) ⭐ | 实用计算 | 复利终值与等额本息贷款摊销表计算。 |
| [MailForge](https://wangzifan396-wzf.github.io/WB/tools/MailForge/) ⭐ | 文本处理 | 邮箱语法校验、解析与角色识别。 |
| [HashForge](https://wangzifan396-wzf.github.io/WB/tools/HashForge/) ⭐ | 编码加密 | 哈希摘要校验器：纯 JS SHA-256/SHA-1/MD5，软件完整性校验。 |
| [BackoffForge](https://wangzifan396-wzf.github.io/WB/tools/BackoffForge/) ⭐ | 开发辅助 | 指数退避与抖动计算器：full/equal/decorrelated 策略，API 重试韧性。 |
| [UnitForge](https://wangzifan396-wzf.github.io/WB/tools/UnitForge/) ⭐ | 实用计算 | 通用单位换算：长度/质量/温度/速度/数据/面积/体积/时间/能量/压强。 |
| [ReadForge](https://wangzifan396-wzf.github.io/WB/tools/ReadForge/) ⭐ | 文本处理 | 文本可读性评分：Flesch Reading Ease 与 Flesch-Kincaid 年级，写作质量。 |
| [RateForge](https://wangzifan396-wzf.github.io/WB/tools/RateForge/) ⭐ | 开发辅助 | 限流算法模拟器：令牌桶与漏桶，refill/consume 纯函数推演，API 韧性设计。 |
| [BloomForge](https://wangzifan396-wzf.github.io/WB/tools/BloomForge/) ⭐ | 数据结构 | 布隆过滤器实验室：FNV-1a 双重哈希，误判率公式推演，海量去重利器。 |
| [HashRingForge](https://wangzifan396-wzf.github.io/WB/tools/HashRingForge/) ⭐ | 开发辅助 | 一致性哈希环：虚拟节点、增删节点迁移推演，分布式分片可视化。 |
| [LzwForge](https://wangzifan396-wzf.github.io/WB/tools/LzwForge/) ⭐ | 编码加密 | LZW 压缩实验室：字典压缩/解压全程可视，压缩率实时对比。 |
| [VectorForge](https://wangzifan396-wzf.github.io/WB/tools/VectorForge/) ⭐ | 实用计算 | 向量相似度计算器：余弦/欧氏/曼哈顿/点积 + Top-K 检索，RAG 向量度量。 |
| [TopoForge](https://wangzifan396-wzf.github.io/WB/tools/TopoForge/) ⭐ | 开发辅助 | 拓扑排序 / DAG 编排器：Kahn 算法 + 并行批次分层 + 环检测。 |
| [FuzzyForge](https://wangzifan396-wzf.github.io/WB/tools/FuzzyForge/) ⭐ | 开发辅助 | 模糊匹配打分器：fzf 风格子序列匹配 + 边界加分 + 结果排序。 |
| [PivotForge](https://wangzifan396-wzf.github.io/WB/tools/PivotForge/) ⭐ | 数据工具 | 交叉表透视器：CSV 明细转行列交叉表，sum/count/avg/min/max + 总计。 |
| [MarkdownForge](https://wangzifan396-wzf.github.io/WB/tools/MarkdownForge/) ⭐ | 文本处理 | Markdown 转 HTML 编译器：标题/列表/代码块/引用/链接，转义防注入。 |
| [PercentileForge](https://wangzifan396-wzf.github.io/WB/tools/PercentileForge/) ⭐ | 实用计算 | 延迟分位数分析器：p50/p90/p95/p99 插值 + 标准差 + ASCII 直方图。 |
| [HmacForge](https://wangzifan396-wzf.github.io/WB/tools/HmacForge/) ⭐ | 编码加密 | HMAC-SHA256 签名器：RFC 4231 向量验证，API 签名 / Webhook 校验。 |
| [MerkleForge](https://wangzifan396-wzf.github.io/WB/tools/MerkleForge/) ⭐ | 数据结构 | 默克尔树构建与证明器：SHA-256 树 + 包含性证明 + 校验。 |
| [GeoForge](https://wangzifan396-wzf.github.io/WB/tools/GeoForge/) ⭐ | 实用计算 | 地理距离计算器：Haversine 大圆距离 + 方位角 + 目的地 + 包围盒。 |
| [CuckooForge](https://wangzifan396-wzf.github.io/WB/tools/CuckooForge/) ⭐ | 数据结构 | 布谷鸟过滤器：可删除的概率型成员判定，指纹 + 双桶 + 踢出重放。 |
| [TokenForge](https://wangzifan396-wzf.github.io/WB/tools/TokenForge/) ⭐ | 实用计算 | LLM Token 估算与成本计算器：确定性子词分词 + 多模型单价表。 |
| [SecretForge](https://wangzifan396-wzf.github.io/WB/tools/SecretForge/) ⭐ | 编码加密 | 密钥/凭据扫描器：正则模式 + 香农熵检测，定位代码中的高危泄露。 |
| [HllForge](https://wangzifan396-wzf.github.io/WB/tools/HllForge/) ⭐ | 数据结构 | HyperLogLog 基数估计：用极少内存估算大规模去重计数（至多高估）。 |
| [SketchForge](https://wangzifan396-wzf.github.io/WB/tools/SketchForge/) ⭐ | 数据结构 | Count-Min Sketch 频次草图：流式频率估计，至多高估。 |
| [TrieForge](https://wangzifan396-wzf.github.io/WB/tools/TrieForge/) ⭐ | 数据结构 | 前缀树 Trie：自动补全、词表检索、前缀计数，零依赖纯函数。 |
| [LruForge](https://wangzifan396-wzf.github.io/WB/tools/LruForge/) ⭐ | 数据结构 | LRU 缓存：容量受限的 Least-Recently-Used 淘汰，Map 实现 O(1)。 |
| [UnionForge](https://wangzifan396-wzf.github.io/WB/tools/UnionForge/) ⭐ | 数据结构 | 并查集 Disjoint Set：连通分量、动态连通性、Kruskal 最小生成树。 |
| [BitsetForge](https://wangzifan396-wzf.github.io/WB/tools/BitsetForge/) ⭐ | 数据结构 | 位集合 Bitset：紧凑位运算、集合交并差、成员判定与位计数。 |
| [BreakerForge](https://wangzifan396-wzf.github.io/WB/tools/BreakerForge/) ⭐ | 开发辅助 | 熔断器 Circuit Breaker：closed/open/half-open 状态机，保护下游服务。 |
| [ArgForge](https://wangzifan396-wzf.github.io/WB/tools/ArgForge/) ⭐ | 开发辅助 | 命令行参数解析器：flags/options/positionals，类型推断与默认值。 |
| [Sha3Forge](https://wangzifan396-wzf.github.io/WB/tools/Sha3Forge/) ⭐ | 编码加密 | SHA-3 / Keccak 哈希：自研 Keccak-f[1600]，SHA3-256/512 与 keccak256。 |
| [Base64Forge](https://wangzifan396-wzf.github.io/WB/tools/Base64Forge/) ⭐ | 编码加密 | Base64 编解码：标准 / URL-safe 双字母表，UTF-8 安全，宽松解码。 |
| [MsgpackForge](https://wangzifan396-wzf.github.io/WB/tools/MsgpackForge/) ⭐ | 数据工具 | MessagePack 编解码：JSON 值到二进制紧凑序列化与十六进制视图。 |
| [PrngForge](https://wangzifan396-wzf.github.io/WB/tools/PrngForge/) ⭐ | 实用计算 | 可复现伪随机：mulberry32 / sfc32 / xoshiro128**，种子→序列/洗牌。 |
| [KmpForge](https://wangzifan396-wzf.github.io/WB/tools/KmpForge/) ⭐ | 数据结构 | KMP 字符串匹配：失配表可视化，线性时间多次命中与高亮。 |
| [TarjanForge](https://wangzifan396-wzf.github.io/WB/tools/TarjanForge/) ⭐ | 数据结构 | Tarjan 强连通分量：一次 DFS 求 SCC，缩点 DAG 与环检测。 |
| [ExprForge](https://wangzifan396-wzf.github.io/WB/tools/ExprForge/) ⭐ | 开发辅助 | 表达式求值器：调度场算法 + RPN，变量 / 函数，无 eval。 |
| [FenwickForge](https://wangzifan396-wzf.github.io/WB/tools/FenwickForge/) ⭐ | 数据结构 | 树状数组：前缀和 / 区间和 / 单点更新 / 树上二分，O(log n)。 |
| [XxhashForge](https://wangzifan396-wzf.github.io/WB/tools/XxhashForge/) ⭐ | 编码加密 | xxHash32 快速哈希：官方向量验证，种子可调，非加密校验。 |
| [LinearForge](https://wangzifan396-wzf.github.io/WB/tools/LinearForge/) ⭐ | 实用计算 | 一元线性回归：最小二乘拟合、R²、残差与 RMSE、预测。 |
| [AstarForge](https://wangzifan396-wzf.github.io/WB/tools/AstarForge/) ⭐ | 数据结构 | A* 网格寻路：曼哈顿启发式 + 路径回溯 + 扩展节点统计。 |
| [SegmentForge](https://wangzifan396-wzf.github.io/WB/tools/SegmentForge/) ⭐ | 数据结构 | 线段树区间和/最值查询 + 懒标记区间加，O(log n)。 |
| [AvlForge](https://wangzifan396-wzf.github.io/WB/tools/AvlForge/) ⭐ | 数据结构 | AVL 自平衡树：LL/RR/LR/RL 四旋转 + 平衡校验 + ASCII 树形。 |
| [RabinForge](https://wangzifan396-wzf.github.io/WB/tools/RabinForge/) ⭐ | 数据结构 | Rabin-Karp 滚动哈希搜索：多模式 + 重叠命中 + 假阳性复核。 |
| [IntervalForge](https://wangzifan396-wzf.github.io/WB/tools/IntervalForge/) ⭐ | 实用计算 | 区间合并/交集/最大不重叠调度/最少会议室，扫描线 + 贪心。 |
| [CombForge](https://wangzifan396-wzf.github.io/WB/tools/CombForge/) ⭐ | 实用计算 | BigInt 组合数学：nCr/nPr/阶乘/卡特兰数/帕斯卡三角，大数精确。 |
| [EloForge](https://wangzifan396-wzf.github.io/WB/tools/EloForge/) ⭐ | 实用计算 | Elo 等级分：期望胜率 + K 因子单局更新 + 批量对局推演。 |
| [Base85Forge](https://wangzifan396-wzf.github.io/WB/tools/Base85Forge/) ⭐ | 编码加密 | Ascii85 + Z85 编解码：z 压缩、尾组截断、RFC 向量校验。 |
| [SoundexForge](https://wangzifan396-wzf.github.io/WB/tools/SoundexForge/) ⭐ | 文本处理 | Soundex + Metaphone 语音编码：人名纠错与同音异拼分组。 |
| [MindMapForge](https://wangzifan396-wzf.github.io/WB/tools/MindMapForge/) ⭐ | 可视化 | 思维导图：缩进大纲一键生成 SVG 导图，按层级着色。 |
| [WordCloudForge](https://wangzifan396-wzf.github.io/WB/tools/WordCloudForge/) ⭐ | 可视化 | 词云生成：中英分词 + 螺旋布局 + AABB 碰撞，高频大字。 |
| [SequenceForge](https://wangzifan396-wzf.github.io/WB/tools/SequenceForge/) ⭐ | 可视化 | 时序图：轻量 DSL 生成泳道时序图，箭头/自环/虚线回包。 |
| [GanttForge](https://wangzifan396-wzf.github.io/WB/tools/GanttForge/) ⭐ | 可视化 | 甘特图：任务/工期/进度可视化，重叠检测 + 加权进度。 |
| [LifeForge](https://wangzifan396-wzf.github.io/WB/tools/LifeForge/) ⭐ | 可视化 | 生命游戏：B3/S23 元胞自动机，环面边界 + 经典模式识别。 |
| [SortForge](https://wangzifan396-wzf.github.io/WB/tools/SortForge/) ⭐ | 数据结构 | 排序可视化：冒泡/插排/选排/快排/归并，比较次数 + 帧快照。 |
| [MazeForge](https://wangzifan396-wzf.github.io/WB/tools/MazeForge/) ⭐ | 数据结构 | 迷宫生成与求解：递归回溯完美迷宫 + BFS 最短路。 |
| [NqueenForge](https://wangzifan396-wzf.github.io/WB/tools/NqueenForge/) ⭐ | 数据结构 | N 皇后：回溯求解 + 全部计数 + 独立校验器。 |
| [StegForge](https://wangzifan396-wzf.github.io/WB/tools/StegForge/) ⭐ | 编码加密 | 零宽隐写：把秘密消息藏进不可见字符，检测/提取/防篡改。 |
| [TuringForge](https://wangzifan396-wzf.github.io/WB/tools/TuringForge/) ⭐ | 可视化 | 图灵机：用 DSL 定义纸带/状态/转移，单步或连续推演，可视化磁带与读写头。 |
| [LsystemForge](https://wangzifan396-wzf.github.io/WB/tools/LsystemForge/) ⭐ | 可视化 | L 系统分形：内置 Koch / 龙曲线 / Plants / Sierpinski，可调迭代次数生成 SVG。 |
| [SudokuForge](https://wangzifan396-wzf.github.io/WB/tools/SudokuForge/) ⭐ | 数据结构 | 数独：随机生成保证唯一解的题目，回溯求解，实时校验冲突。 |
| [GomokuForge](https://wangzifan396-wzf.github.io/WB/tools/GomokuForge/) ⭐ | 数据结构 | 五子棋：15×15 棋盘，启发式 AI 先攻后守，自动判定五连胜负。 |
| [NoiseForge](https://wangzifan396-wzf.github.io/WB/tools/NoiseForge/) ⭐ | 实用计算 | Perlin 噪声：生成 2D 噪声场，灰度或地形色带渲染，可调缩放与种子，离线可用。 |
| [BezierForge](https://wangzifan396-wzf.github.io/WB/tools/BezierForge/) ⭐ | 设计工具 | 贝塞尔曲线：可视化编辑三次贝塞尔控制点，实时预览曲线，导出 SVG path。 |
| [JsonGraphForge](https://wangzifan396-wzf.github.io/WB/tools/JsonGraphForge/) ⭐ | 可视化 | JSON 图谱：把 JSON 结构渲染为节点-连线树图，直观看清嵌套与键关系。 |
| [RegexRailForge](https://wangzifan396-wzf.github.io/WB/tools/RegexRailForge/) ⭐ | 开发辅助 | 正则铁路图：把正则解析为铁路图，直观看到拼接/选择/量词的语法结构。 |
| [TetrisForge](https://wangzifan396-wzf.github.io/WB/tools/TetrisForge/) ⭐ | 数据结构 | 俄罗斯方块：纯逻辑内核（碰撞/旋转/消行）+ Canvas 游戏，方向键操作。 |
| [TokenizeForge](https://wangzifan396-wzf.github.io/WB/tools/TokenizeForge/) ⭐ | 可视化 | BPE 分词可视化：词频统计、相邻对计分、逐轮合并，把文本编码为子词 token。 |
| [BoidsForge](https://wangzifan396-wzf.github.io/WB/tools/BoidsForge/) ⭐ | 可视化 | Boids 群体模拟：分离/对齐/聚合三力，环面世界，Canvas 实时推演 flocking。 |
| [RaycastForge](https://wangzifan396-wzf.github.io/WB/tools/RaycastForge/) ⭐ | 可视化 | 光线投射：2.5D DDA 射线投射，网格迷宫第一人称投影，方向键漫游。 |
| [PendulumForge](https://wangzifan396-wzf.github.io/WB/tools/PendulumForge/) ⭐ | 可视化 | 双摆混沌：RK4 积分求解，能量漂移检测，初值敏感性演示。 |
| [QuadtreeForge](https://wangzifan396-wzf.github.io/WB/tools/QuadtreeForge/) ⭐ | 图像工具 | 四叉树图像近似：递归细分逼近细节，叶子统计与实时预览。 |
| [TspForge](https://wangzifan396-wzf.github.io/WB/tools/TspForge/) ⭐ | 实用计算 | TSP 求解：最近邻播种 + 2-opt 精炼，巡游长度与迭代轨迹。 |
| [KnapsackForge](https://wangzifan396-wzf.github.io/WB/tools/KnapsackForge/) ⭐ | 实用计算 | 0/1 背包：动态规划最优选择，贪心对照，回溯选取物品。 |
| [DitherForge](https://wangzifan396-wzf.github.io/WB/tools/DitherForge/) ⭐ | 图像工具 | 图像抖动：有序 Bayer 与 Floyd-Steinberg 误差扩散，1-bit 输出。 |
| [SpiroForge](https://wangzifan396-wzf.github.io/WB/tools/SpiroForge/) ⭐ | 可视化 | 万花尺：内/外旋轮线曲线，周期计算与 SVG 导出。 |
| [VoronoiForge](https://wangzifan396-wzf.github.io/WB/tools/VoronoiForge/) ⭐ | 设计工具 | Voronoi 图生成器：放置站点，实时计算平面每点的最近邻站点并着色，生成细胞状图案，可点击增点，离线可用。 |
| [HarmonographForge](https://wangzifan396-wzf.github.io/WB/tools/HarmonographForge/) ⭐ | 可视化 | 谐振图（Harmonograph）：多摆正弦叠加生成优雅的衰减曲线图案，可调频率/相位/阻尼，离线可用。 |
| [ClothForge](https://wangzifan396-wzf.github.io/WB/tools/ClothForge/) ⭐ | 可视化 | 布料模拟：Verlet 积分 + 距离约束，顶部钉住，重力下垂，可拖拽扰动，实时观察弹性形变，离线可用。 |
| [WaveForge](https://wangzifan396-wzf.github.io/WB/tools/WaveForge/) ⭐ | 可视化 | 水波模拟：二维波动方程离散求解，点击激起波纹，阻尼控制扩散与衰减，实时观察干涉，离线可用。 |
| [SandForge](https://wangzifan396-wzf.github.io/WB/tools/SandForge/) ⭐ | 图像工具 | 落沙模拟：元胞自动机，沙粒受重力下落/斜滑，遇墙堆积，可绘制沙与障碍物，实时观察堆积形态，离线可用。 |
| [ReactionForge](https://wangzifan396-wzf.github.io/WB/tools/ReactionForge/) ⭐ | 可视化 | 反应扩散（Gray-Scott）：两种化学物质扩散与反应，自发涌现出斑点、条纹、迷宫等图灵斑图，可调参数探索，离线可用。 |
| [MinesweeperForge](https://wangzifan396-wzf.github.io/WB/tools/MinesweeperForge/) ⭐ | 可视化 | 扫雷：种子化布雷 + Flood-fill 翻开 + 旗标，自动判定胜负，经典逻辑游戏，离线可用。 |
| [2048Forge](https://wangzifan396-wzf.github.io/WB/tools/2048Forge/) ⭐ | 可视化 | 2048：方向键合并相同数字，棋盘满且无可合并即失败。纯逻辑内核可断言，含随机种子复现，离线可用。 |
| [SokobanForge](https://wangzifan396-wzf.github.io/WB/tools/SokobanForge/) ⭐ | 可视化 | 推箱子：把箱子全部推到目标点。纯逻辑内核可断言移动/推动/胜利，内置多关卡，方向键操作，离线可用。 |
| [ImgConvertForge](https://wangzifan396-wzf.github.io/WB/tools/ImgConvertForge/) ⭐ | 图像工具 | 图片格式转换：浏览器内将 PNG/JPEG/WebP 互转，可调质量与最大边长，Canvas 实时预览并下载，零上传、离线可用。 |
| [SigForge](https://wangzifan396-wzf.github.io/WB/tools/SigForge/) ⭐ | 开发辅助 | 邮件签名生成器：可视化配置头像、姓名、职位、联系方式与社媒链接，输出兼容 Outlook 的 HTML 签名，一键复制，离线可用。 |
| [ClipForge](https://wangzifan396-wzf.github.io/WB/tools/ClipForge/) ⭐ | 开发辅助 | CSS clip-path 编辑器：内置多边形/箭头/星形/六边形/气泡预设，可增删顶点，实时预览并复制 CSS，离线可用。 |
| [OgForge](https://wangzifan396-wzf.github.io/WB/tools/OgForge/) ⭐ | 设计工具 | OG 社交卡片生成器：可视化编辑标题/描述/配色，实时生成 1200×630 预览与 meta 标签，利于分享卡片，离线可用。 |
| [BrailleForge](https://wangzifan396-wzf.github.io/WB/tools/BrailleForge/) ⭐ | 图像工具 | 盲文点阵生成器：将文字渲染为盲文 Unicode 点阵字符画，支持反相与画布尺寸调节，复古终端风格，离线可用。 |
| [LangtonForge](https://wangzifan396-wzf.github.io/WB/tools/LangtonForge/) ⭐ | 可视化 | Langton's Ant 元胞自动机：支持多只蚂蚁在环面上推演，观察简单规则涌现的高速公路与混沌图案，实时步进，离线可用。 |
| [JuliaForge](https://wangzifan396-wzf.github.io/WB/tools/JuliaForge/) ⭐ | 可视化 | Julia 集分形渲染器：可调复常数与配色，实时渲染经典分形图案，内置多组预设，离线可用。 |
| [WordleForge](https://wangzifan396-wzf.github.io/WB/tools/WordleForge/) ⭐ | 可视化 | Wordle 猜词游戏：内置词库与种子复现，绿/黄/灰精确反馈，键盘状态联动，纯逻辑内核可断言，离线可用。 |
| [ParticleForge](https://wangzifan396-wzf.github.io/WB/tools/ParticleForge/) ⭐ | 可视化 | 粒子系统模拟：支持喷泉/烟花/雪花等模式，基于种子的确定性运动，实时观察粒子积分轨迹，离线可用。 |
| [ArchForge](https://wangzifan396-wzf.github.io/WB/tools/ArchForge/) ⭐ | 可视化 | 架构图即代码：用「web -> api」式 DSL 描述依赖，自动分层布局生成 SVG 架构图，支持环检测与 SVG 导出，离线可用。 |
| [DagForge](https://wangzifan396-wzf.github.io/WB/tools/DagForge/) ⭐ | 数据结构 | DAG 工作流分析器：任务依赖 DSL 一键得到拓扑执行顺序、关键路径与总工期，自带环检测，离线可用。 |
| [DocxForge](https://wangzifan396-wzf.github.io/WB/tools/DocxForge/) ⭐ | 实用计算 | 纯前端 Word 生成器：粘贴文本即可打包为标准 .docx（最小 OOXML + 无压缩 ZIP，自实现 CRC32），支持标题行，零依赖离线可用。 |
| [XlsxForge](https://wangzifan396-wzf.github.io/WB/tools/XlsxForge/) ⭐ | 数据工具 | 纯前端 Excel 生成器：粘贴 CSV 即打包为标准 .xlsx（inline string + 数字类型自动识别，自实现 STORED ZIP），零依赖离线可用。 |
| [PomodoroForge](https://wangzifan396-wzf.github.io/WB/tools/PomodoroForge/) ⭐ | 实用计算 | 番茄钟：纯函数状态机驱动（工作/短休/长休自动轮转，每 4 个番茄进长休），完成统计与进度环，离线可用。 |
| [TraceForge](https://wangzifan396-wzf.github.io/WB/tools/TraceForge/) ⭐ | 可视化 | 链路追踪瀑布图：粘贴 span JSON（name/start/dur/parent），按层级缩进渲染耗时瀑布 SVG，自动找出最慢 span，离线可用。 |
| [MarkovForge](https://wangzifan396-wzf.github.io/WB/tools/MarkovForge/) ⭐ | 文本处理 | 马尔可夫链文本生成器：从语料构建 N 阶转移表并采样生成新文本，支持中文逐字/英文逐词双模式与可注入随机源，离线可用。 |
| [WfcForge](https://wangzifan396-wzf.github.io/WB/tools/WfcForge/) ⭐ | 可视化 | 波函数坍缩（WFC）地形生成器：海/滩/草/林/山邻接约束，最小熵坍缩 + 约束传播，种子可复现，SVG 网格渲染，离线可用。 |
| [PlotForge](https://wangzifan396-wzf.github.io/WB/tools/PlotForge/) ⭐ | 可视化 | 函数绘图器：输入 sin(x)*x 等表达式即渲染 SVG 曲线，递归下降解析器支持 + - * / ^ 与常用函数，多曲线叠加，离线可用。 |
| [TimelineForge](https://wangzifan396-wzf.github.io/WB/tools/TimelineForge/) ⭐ | 可视化 | 时间线生成器：「日期 | 标题 | 描述」一行一事件，自动排序后渲染左右交替时间线 SVG，支持年月日三种粒度，离线可用。 |
| [StatForge](https://wangzifan396-wzf.github.io/WB/tools/StatForge/) ⭐ | 数据工具 | 统计与线性回归：均值/中位数/众数、方差/标准差、四分位与 IQR、线性拟合（斜率/截距/R²），一键出直方图，离线可用。 |
| [LoanForge](https://wangzifan396-wzf.github.io/WB/tools/LoanForge/) ⭐ | 实用计算 | 贷款本息摊销：输入本金、年利率与期限，输出月供、总利息与逐期还款计划表，离线可用。 |
| [SplitForge](https://wangzifan396-wzf.github.io/WB/tools/SplitForge/) ⭐ | 实用计算 | 聚餐 AA 分摊：逐条录入账单，自动加计小费/税费/折扣，按人数均摊出每人应付，离线可用。 |
| [BmiForge](https://wangzifan396-wzf.github.io/WB/tools/BmiForge/) ⭐ | 实用计算 | BMI 与健康区间：输入身高体重得 BMI 与中国成人标准分级，并给出健康体重范围与体脂率估算，离线可用。 |
| [StrengthForge](https://wangzifan396-wzf.github.io/WB/tools/StrengthForge/) ⭐ | 安全工具 | 密码强度估计：按字符集熵估算强度等级与暴力破解耗时，识别常见弱口令与模式，离线可用。 |
| [HashIdForge](https://wangzifan396-wzf.github.io/WB/tools/HashIdForge/) ⭐ | 编码加密 | 哈希类型识别：根据长度、字符集与特征前缀判断 md5/sha 系列/bcrypt/argon2/ntlm 等，离线可用。 |
| [WorldClockForge](https://wangzifan396-wzf.github.io/WB/tools/WorldClockForge/) ⭐ | 实用计算 | 世界时钟：并排显示多个时区当前时间，自动算时差，基于 Intl 离线可用。 |
| [CountdownForge](https://wangzifan396-wzf.github.io/WB/tools/CountdownForge/) ⭐ | 实用计算 | 多倒计时：添加多个目标时刻，实时显示剩余天/时/分/秒，本地保存，离线可用。 |
| [RecipeForge](https://wangzifan396-wzf.github.io/WB/tools/RecipeForge/) ⭐ | 效率工具 | 食谱管理：录入配料一键按份量缩放，本地保存多个食谱，离线可用。 |
| [ExpenseForge](https://wangzifan396-wzf.github.io/WB/tools/ExpenseForge/) ⭐ | 效率工具 | 记账与预算：录入收支、按分类与月份汇总，本地保存，离线可用。 |
| [TimestampForge](https://wangzifan396-wzf.github.io/WB/tools/TimestampForge/) ⭐ | 实用计算 | Unix 时间戳 ↔ 日期转换：秒 / 毫秒互转、UTC 与本地时间、星期计算，离线可用。 |
| [PassgenForge](https://wangzifan396-wzf.github.io/WB/tools/PassgenForge/) ⭐ | 安全工具 | 安全密码生成器：自定义长度与字符集、实时熵估算、浏览器本地随机，离线可用。 |
| [AgeForge](https://wangzifan396-wzf.github.io/WB/tools/AgeForge/) ⭐ | 实用计算 | 年龄与日期差计算：精确到岁 / 月 / 天与合计天数，离线可用。 |
| [MacForge](https://wangzifan396-wzf.github.io/WB/tools/MacForge/) ⭐ | 网络 | MAC 地址工具：随机生成 / 校验 / 规范化、单播多播与本地判定、OUI 厂商查询，离线可用。 |
| [NanoidForge](https://wangzifan396-wzf.github.io/WB/tools/NanoidForge/) ⭐ | 开发辅助 | 短 ID 与 UUID 生成器：URL 安全 / 十六进制 / 去歧义字符集、UUID v4，离线可用。 |
| [SitemapForge](https://wangzifan396-wzf.github.io/WB/tools/SitemapForge/) ⭐ | 开发辅助 | sitemap.xml 生成器：URL 列表一键生成标准站点地图，支持更新频率 / 优先级 / 日期，离线可用。 |
| [WordCountForge](https://wangzifan396-wzf.github.io/WB/tools/WordCountForge/) ⭐ | 文本处理 | 文本字数统计：字符 / 词 / 行 / 句 / 段与预计阅读时间，中英混排，离线可用。 |
| [SqlFmtForge](https://wangzifan396-wzf.github.io/WB/tools/SqlFmtForge/) ⭐ | 开发辅助 | SQL 格式化：关键字大写、主要子句换行、保留字符串字面量，离线可用。 |
| [CalorieForge](https://wangzifan396-wzf.github.io/WB/tools/CalorieForge/) ⭐ | 效率工具 | 卡路里与营养记账：记录饮食热量与蛋白 / 碳水 / 脂肪，本机保存，离线可用。 |
| [StopwatchForge](https://wangzifan396-wzf.github.io/WB/tools/StopwatchForge/) ⭐ | 实用计算 | 秒表与计圈计时：毫秒精度、暂停 / 继续、圈速最佳最差统计，离线可用。 |
| [SrtForge](https://wangzifan396-wzf.github.io/WB/tools/SrtForge/) ⭐ | 文本处理 | 字幕工具：SRT 与 WebVTT 互转、时间轴平移与速率缩放、重叠检测与统计，离线可用。 |
| [JsonSchemaForge](https://wangzifan396-wzf.github.io/WB/tools/JsonSchemaForge/) ⭐ | 开发辅助 | JSON Schema 校验器：type / required / enum / pattern 与数值数组约束，错误精确到路径，可从数据反推 Schema，离线可用。 |
| [HttpStatusForge](https://wangzifan396-wzf.github.io/WB/tools/HttpStatusForge/) ⭐ | 网络 | HTTP 状态码速查：五大分类语义说明、可重试与可缓存判定、关键词检索，离线可用。 |
| [AnsiForge](https://wangzifan396-wzf.github.io/WB/tools/AnsiForge/) ⭐ | 文本处理 | ANSI 终端着色：转义序列渲染为彩色 HTML、一键去色还原纯文本、SGR 序列统计，离线可用。 |
| [FrontmatterForge](https://wangzifan396-wzf.github.io/WB/tools/FrontmatterForge/) ⭐ | 文本处理 | Markdown Front-matter 体检：YAML 子集解析、必填字段校验、重复键与 SEO 长度提醒、规范化回写，离线可用。 |
| [PhoneForge](https://wangzifan396-wzf.github.io/WB/tools/PhoneForge/) ⭐ | 实用计算 | 国际电话号码解析：20 国国家码识别、E.164 规范化、位数与号段校验、脱敏展示，离线可用。 |
| [IbanForge](https://wangzifan396-wzf.github.io/WB/tools/IbanForge/) ⭐ | 安全工具 | IBAN 与银行卡校验：mod-97 校验位推算、41 国长度表、四位分组格式化、Luhn 校验，离线可用。 |
| [PaceForge](https://wangzifan396-wzf.github.io/WB/tools/PaceForge/) ⭐ | 实用计算 | 跑步配速计算：配速 / 用时 / 速度三向互算、公里分段表、Riegel 公式预测 5K 到全马，离线可用。 |
| [KeycodeForge](https://wangzifan396-wzf.github.io/WB/tools/KeycodeForge/) ⭐ | 开发辅助 | 键盘事件查看器：实时捕获 key / code / keyCode、组合键与 macOS 记法、按码反查，离线可用。 |
| [RobotsForge](https://wangzifan396-wzf.github.io/WB/tools/RobotsForge/) ⭐ | 网络 | robots.txt 生成与抓取测试：按 UA 选组、最长匹配判定、通配符与 $ 锚点、语法体检，离线可用。 |
| [ChefForge](https://wangzifan396-wzf.github.io/WB/tools/ChefForge/) ⭐ | 编码加密 | 链式编解码流水线：Base64/Hex/URL/ROT13/XOR 组合配方、逐步中间结果，离线可用。 |
| [AttentionForge](https://wangzifan396-wzf.github.io/WB/tools/AttentionForge/) ⭐ | AI 工具 | Transformer 注意力可视化：QK 缩放点积、softmax 权重热力矩阵、因果掩码，离线可用。 |
| [DbmlForge](https://wangzifan396-wzf.github.io/WB/tools/DbmlForge/) ⭐ | 开发辅助 | DBML 转 SQL DDL：双方言生成、外键推导、Mermaid ER 导出与 schema 体检，离线可用。 |
| [FlamegraphForge](https://wangzifan396-wzf.github.io/WB/tools/FlamegraphForge/) ⭐ | 可视化 | 火焰图渲染器：折叠栈转 SVG、self 时间排行、最热调用路径，离线可用。 |
| [HeatmapForge](https://wangzifan396-wzf.github.io/WB/tools/HeatmapForge/) ⭐ | 可视化 | 日历活动热力图：GitHub 风格贡献格、分位配色、连续打卡统计，离线可用。 |
| [TreeForge](https://wangzifan396-wzf.github.io/WB/tools/TreeForge/) ⭐ | 文本处理 | 目录树生成器：缩进与路径列表转 tree 连线图，JSON/ASCII 互转，离线可用。 |
| [JsonLdForge](https://wangzifan396-wzf.github.io/WB/tools/JsonLdForge/) ⭐ | 开发辅助 | JSON-LD 结构化数据校验：schema.org 字段体检、日期校验、嵌入片段生成，离线可用。 |
| [DmarcForge](https://wangzifan396-wzf.github.io/WB/tools/DmarcForge/) ⭐ | 安全工具 | DMARC 记录分析：标签解读、防护评分分级、语法体检与记录生成，离线可用。 |
| [GraphqlForge](https://wangzifan396-wzf.github.io/WB/tools/GraphqlForge/) ⭐ | 开发辅助 | GraphQL 查询分析：变量片段体检、变量模板生成、复杂度评分，离线可用。 |
| [LlmCostForge](https://wangzifan396-wzf.github.io/WB/tools/LlmCostForge/) ⭐ | AI 工具 | 大模型调用成本测算：token 估算、10 款模型比价、缓存节省与窗口预警，离线可用。 |
| [SeoForge](https://wangzifan396-wzf.github.io/WB/tools/SeoForge/) ⭐ | 开发辅助 | SEO 与元数据分析：标题/描述/OG/Twitter/结构化数据体检、评分分级、关键词密度，离线可用。 |
| [JsonDiffForge](https://wangzifan396-wzf.github.io/WB/tools/JsonDiffForge/) ⭐ | 数据工具 | 结构化 JSON 差异比对：递归扁平化、新增/删除/修改逐项列出、路径级定位，离线可用。 |
| [RegexExplainForge](https://wangzifan396-wzf.github.io/WB/tools/RegexExplainForge/) ⭐ | 开发辅助 | 正则可视化解释器：逐片段中文化说明、分组/量词/转义解析、语法错误定位，离线可用。 |
| [TreemapForge](https://wangzifan396-wzf.github.io/WB/tools/TreemapForge/) ⭐ | 可视化 | 方块树图生成器：squarified 布局、面积占比可视化、SVG 导出，离线可用。 |
| [SvgOptForge](https://wangzifan396-wzf.github.io/WB/tools/SvgOptForge/) ⭐ | 图像工具 | SVG 压缩优化器：去注释、数值取整、空白折叠、体积统计，离线可用。 |
| [SpfForge](https://wangzifan396-wzf.github.io/WB/tools/SpfForge/) ⭐ | 安全工具 | SPF 记录分析：机制解析、DNS 查询计数、防护评级 A-F、合规建议，离线可用。 |
| [DkimForge](https://wangzifan396-wzf.github.io/WB/tools/DkimForge/) ⭐ | 安全工具 | DKIM 记录分析：标签解读、密钥强度估算、防护评分分级、语法体检，离线可用。 |
| [CorsForge](https://wangzifan396-wzf.github.io/WB/tools/CorsForge/) ⭐ | 开发辅助 | CORS 配置校验：通配符/多来源/凭证组合风险检测、合规评级，离线可用。 |
| [HttpHeadersForge](https://wangzifan396-wzf.github.io/WB/tools/HttpHeadersForge/) ⭐ | 安全工具 | HTTP 安全响应头审计：HSTS/CSP/COOP 等 8 项体检、评分分级、修复建议，离线可用。 |
| [ColorContrastForge](https://wangzifan396-wzf.github.io/WB/tools/ColorContrastForge/) ⭐ | 设计工具 | WCAG 颜色对比度计算器：相对亮度、对比比率、AA/AAA 通过判定与实时预览，离线可用。 |
| [PngForge](https://wangzifan396-wzf.github.io/WB/tools/PngForge/) ⭐ | 图像工具 | PNG 元数据解析：读取 IHDR 尺寸/色彩类型/位深/交错、调色板与 ICC 标记、tEXt 文本块，离线可用。 |
| [EasingForge](https://wangzifan396-wzf.github.io/WB/tools/EasingForge/) ⭐ | 设计工具 | 缓动函数库：10 种经典曲线 + cubic-bezier 牛顿迭代求值，SVG 曲线可视化预览，离线可用。 |
| [GridForge](https://wangzifan396-wzf.github.io/WB/tools/GridForge/) ⭐ | 设计工具 | CSS Grid 模板生成器：列/行/单位/间距实时生成 grid-template 与模板区域，带可视预览，离线可用。 |
| [RateLimitForge](https://wangzifan396-wzf.github.io/WB/tools/RateLimitForge/) ⭐ | 开发辅助 | 限流算法可视化：令牌桶/漏桶/滑动窗口的可用量、剩余量与容量估算，附算法对比说明，离线可用。 |
| [SqlExplainForge](https://wangzifan396-wzf.github.io/WB/tools/SqlExplainForge/) ⭐ | 开发辅助 | SQL 执行顺序解析：拆解 SELECT/FROM/JOIN/WHERE/GROUP/ORDER/LIMIT，按真实执行步骤还原，离线可用。 |
| [LzStringForge](https://wangzifan396-wzf.github.io/WB/tools/LzStringForge/) ⭐ | 编码加密 | LZW 字符串压缩：纯 JS 文本压缩为 Base64、UTF-8 安全、压缩率统计与无损还原，离线可用。 |
| [IcoForge](https://wangzifan396-wzf.github.io/WB/tools/IcoForge/) ⭐ | 图像工具 | PNG 转 ICO：校验 PNG 签名、读取尺寸并打包为 Windows .ico 容器供下载，纯前端离线生成。 |
| [SvgPathForge](https://wangzifan396-wzf.github.io/WB/tools/SvgPathForge/) ⭐ | 设计工具 | SVG path 工具箱：命令解析、相对↔绝对互转、包围盒计算与坐标数值简化取整，离线可用。 |
| [JsonPointerForge](https://wangzifan396-wzf.github.io/WB/tools/JsonPointerForge/) ⭐ | 数据工具 | RFC 6901 JSON Pointer：按 /a/b/1 取值与赋值、~0/~1 转义处理，便于 JSON 补丁与定位，离线可用。 |
| [AsciiTableForge](https://wangzifan396-wzf.github.io/WB/tools/AsciiTableForge/) ⭐ | 文本处理 | ASCII 表格生成器：Tab/逗号分隔行列数据渲染为带边框、列宽对齐的纯文本表格，离线可用。 |
| [McpForge](https://wangzifan396-wzf.github.io/WB/tools/McpForge/) ⭐ | AI 工具 | MCP 服务器配置生成与体检：stdio/sse/http 传输识别、参数与环境变量解析、硬编码密钥审计，离线可用。 |
| [RagForge](https://wangzifan396-wzf.github.io/WB/tools/RagForge/) ⭐ | AI 工具 | RAG 分块规划器：中英混排 token 估算、重叠切分与冗余率、上下文预算分配、Embedding 成本测算，离线可用。 |
| [AgentSchemaForge](https://wangzifan396-wzf.github.io/WB/tools/AgentSchemaForge/) ⭐ | AI 工具 | Agent 工具调用 Schema 生成：OpenAI/Anthropic/MCP 三种风格互转、lint 检查与调用参数校验，离线可用。 |
| [DnsForge](https://wangzifan396-wzf.github.io/WB/tools/DnsForge/) ⭐ | 网络 | DNS 记录校验与 zone 解析：A/AAAA/CNAME/MX/TXT/NS/SRV/CAA 逐条体检、TTL 换算与 CNAME 冲突检测，离线可用。 |
| [HttpCacheForge](https://wangzifan396-wzf.github.io/WB/tools/HttpCacheForge/) ⭐ | 网络 | Cache-Control 策略生成：六种场景预设、max-age/s-maxage/SWR 新鲜度推演、响应头冲突体检与 ETag 生成，离线可用。 |
| [TlsForge](https://wangzifan396-wzf.github.io/WB/tools/TlsForge/) ⭐ | 安全工具 | TLS 密码套件体检：前向保密/AEAD 判定与 A–F 评分、协议版本风险表、HSTS 生成与证书到期提醒，离线可用。 |
| [CspForge](https://wangzifan396-wzf.github.io/WB/tools/CspForge/) ⭐ | 安全工具 | 内容安全策略生成与评分：strict/basic/lockdown 三档模板、nonce 生成、unsafe-inline 与通配符风险检测，离线可用。 |
| [SriForge](https://wangzifan396-wzf.github.io/WB/tools/SriForge/) ⭐ | 安全工具 | 子资源完整性 SRI：纯前端 SHA-256 摘要（base64/hex）、integrity 解析校验、script/link 标签生成与跨域体检，离线可用。 |
| [BlurhashForge](https://wangzifan396-wzf.github.io/WB/tools/BlurhashForge/) ⭐ | 图像工具 | BlurHash 编解码：base83 与 DCT 分量还原、Canvas 实时预览、渐变编码生成与 CSS 占位图导出，离线可用。 |
| [NdjsonForge](https://wangzifan396-wzf.github.io/WB/tools/NdjsonForge/) ⭐ | 数据工具 | NDJSON/JSON Lines 处理：逐行校验与错误定位、嵌套字段画像、类型一致性体检、JSON 数组与 CSV 互转，离线可用。 |
| [EvalForge](https://wangzifan396-wzf.github.io/WB/tools/EvalForge/) ⭐ | AI 工具 | LLM 输出评测：BLEU-4 / ROUGE-L / token F1 / 编辑相似度逐项打分，支持批量成对评测与 pass@k 估算，离线可用。 |
| [PromptDiffForge](https://wangzifan396-wzf.github.io/WB/tools/PromptDiffForge/) ⭐ | AI 工具 | 提示词版本对比：LCS 行级差异与词级高亮、token 增减率、六款模型调用成本影响与 prompt lint，离线可用。 |
| [WebhookForge](https://wangzifan396-wzf.github.io/WB/tools/WebhookForge/) ⭐ | 安全工具 | Webhook 签名校验：Stripe/GitHub/Shopify/Slack 五种方案本地 HMAC-SHA256 验签、重放窗口检查与退避重试推演，离线可用。 |
| [OpenapiForge](https://wangzifan396-wzf.github.io/WB/tools/OpenapiForge/) ⭐ | 开发辅助 | OpenAPI 规范体检：内置 YAML/JSON 解析、operationId 重复与路径参数未声明检测、响应覆盖率 A–F 评分与 curl 生成，离线可用。 |
| [ProtoForge](https://wangzifan396-wzf.github.io/WB/tools/ProtoForge/) ⭐ | 开发辅助 | Protobuf 结构解析：message/enum/service/oneof/map 语法解析、wire type 与 tag 字节开销测算、字段号体检与 TypeScript 导出，离线可用。 |
| [DepGraphForge](https://wangzifan396-wzf.github.io/WB/tools/DepGraphForge/) ⭐ | 开发辅助 | 依赖体检与循环检测：package.json 版本范围风险打分、模块依赖图循环查找、拓扑排序与扇入扇出指标、DOT 导出，离线可用。 |
| [SankeyForge](https://wangzifan396-wzf.github.io/WB/tools/SankeyForge/) ⭐ | 可视化 | 桑基流量图：一行一条流向文本直出 SVG，最长路径自动分层、贝塞尔缎带渲染与节点流量守恒体检，离线可用。 |
| [WaterfallForge](https://wangzifan396-wzf.github.io/WB/tools/WaterfallForge/) ⭐ | 可视化 | 瀑布图：期初到期末的增减归因，红涨绿跌符合 A 股习惯，自动累计与连接线、贡献度排序与 SVG 导出，离线可用。 |
| [RadarForge](https://wangzifan396-wzf.github.io/WB/tools/RadarForge/) ⭐ | 可视化 | 雷达图：多维能力对比直出 SVG，覆盖面积占比、均衡度与变异系数、逐轴最优最差与极差分析，离线可用。 |
| [CalendarHeatForge](https://wangzifan396-wzf.github.io/WB/tools/CalendarHeatForge/) ⭐ | 可视化 | 日历热力图：GitHub 风格贡献格，同日累加、五档配色、当前与最长连续天数、活跃覆盖率与星期分布，离线可用。 |
| [PkceForge](https://wangzifan396-wzf.github.io/WB/tools/PkceForge/) ⭐ | 安全工具 | OAuth 2.0 PKCE 全流程本地推演：verifier 与 S256 challenge 浏览器内生成、授权 URL 拼装、回调 state 校验与流程安全体检，离线可用。 |
| [RssForge](https://wangzifan396-wzf.github.io/WB/tools/RssForge/) ⭐ | 数据工具 | 订阅源生成：一份条目同时导出 RSS 2.0 / Atom 1.0 / JSON Feed，XML 转义、RFC822/RFC3339 时间格式化与订阅源体检，离线可用。 |
| [IcsForge](https://wangzifan396-wzf.github.io/WB/tools/IcsForge/) ⭐ | 效率工具 | iCalendar 生成：一行一个事件自动折叠 75 字节、生成 UID 与 RRULE，UTC/浮动/全天三种时间模式，导出前检测时间冲突与结构性错误，离线可用。 |
| [K8sForge](https://wangzifan396-wzf.github.io/WB/tools/K8sForge/) ⭐ | 开发辅助 | Kubernetes 清单生成：Deployment / Service / Ingress / ConfigMap / Secret / HPA / PVC 一键产出合规 YAML，Secret 值自动 base64，命名规范化与镜像 tag、副本数体检，离线可用。 |
| [PromQLForge](https://wangzifan396-wzf.github.io/WB/tools/PromQLForge/) ⭐ | 数据工具 | PromQL 查询生成：指标名 + 标签匹配 + rate/increase 区间函数 + sum/avg by 聚合 + offset 偏移，内置 CPU/内存/QPS/P99 模板与括号、时长、函数名体检，离线可用。 |
| [WAFForge](https://wangzifan396-wzf.github.io/WB/tools/WAFForge/) ⭐ | 安全工具 | WAF 规则生成：ModSecurity / OWASP-CRS 风格 SecRule 与等价 JSON 策略同时产出，内置 SQLi、XSS、路径遍历、IP 封禁、限流模板与 rule id、phase、动作体检，离线可用。 |
| [JqForge](https://wangzifan396-wzf.github.io/WB/tools/JqForge/) ⭐ | 数据工具 | jq 风格 JSON 变换：浏览器内实现字段访问、数组索引、管道与 map/select/keys/sort_by/group_by/unique/add 等子集解释器，支持比较与 and/or 过滤，数据不出本机。 |
| [FlexboxForge](https://wangzifan396-wzf.github.io/WB/tools/FlexboxForge/) ⭐ | 设计工具 | Flexbox 沙盒：内置完整 flex 布局解算（换行行断、grow/shrink 加权、align-self、order），左浏览器原生、右内核坐标双视图对照，附圣杯布局等 8 个配方与 CSS 一键导出、溢出体检，离线可用。 |
| [ShadowForge](https://wangzifan396-wzf.github.io/WB/tools/ShadowForge/) ⭐ | 设计工具 | 多层阴影工坊：以指数曲线生成 1–10 层协调阴影，内置 Material 0–5 高程阶梯，支持 box/text/drop 类型反解粘贴与累计透明度、CSS 变量、Tailwind 输出，附光源方向与硬度体检，离线可用。 |
| [PemForge](https://wangzifan396-wzf.github.io/WB/tools/PemForge/) ⭐ | 安全工具 | PEM / X.509 检查器：内置 ASN.1 DER 编解码器，解析证书、CSR 与 RSA/EC 私钥，展示 ASN.1 结构树与字节偏移并规范化重编码，附 SHA-1/弱 RSA/有效期/398 天/SAN/v1 等体检，数据不出本机。 |
| [HtaccessForge](https://wangzifan396-wzf.github.io/WB/tools/HtaccessForge/) ⭐ | 网络 | Apache .htaccess 生成器：HTTPS/www 跳转、自定义重定向、SPA 重写、缓存与 Gzip、安全响应头、CORS、防盗链、Basic 认证、IP/UA 封禁、错误页一键产出，附逐行解释、配置体检与统计，与 NginxForge 对位，离线可用。 |
| [WebSocketForge](https://wangzifan396-wzf.github.io/WB/tools/WebSocketForge/) ⭐ | 网络 | WebSocket 调试台：实时收发、子协议协商、模板变量与心跳保活，外加 RFC 6455 帧开销计算、1000–4999 全量关闭码释义、指数退避重连规划与连接配置体检，断线自愈全过程可见，离线可用。 |
| [SseForge](https://wangzifan396-wzf.github.io/WB/tools/SseForge/) ⭐ | 网络 | Server-Sent Events 工作台：内置符合 WHATWG 规范的 SSE 线格式解析器，正确处理 CRLF/CR/LF 混排、BOM、多行 data 拼接、空 data 不派发与非法 retry 忽略；支持逐字节分块投喂模拟、流体检、EventSource 实时客户端与 Nginx/Node 服务端速查，离线可用。 |
| [MqttForge](https://wangzifan396-wzf.github.io/WB/tools/MqttForge/) ⭐ | 网络 | MQTT 3.1.1 报文工坊：手写实现的二进制编解码器，可构造 CONNECT/PUBLISH/SUBSCRIBE/UNSUBSCRIBE 等控制报文并逐字节拆解字段含义，内置变长剩余长度编码、粘包与截断识别、主题通配符匹配器（#/+/$ 规范细则）与 MQTT-over-WebSocket 实时客户端，离线可用。 |
| [SdpForge](https://wangzifan396-wzf.github.io/WB/tools/SdpForge/) ⭐ | 网络 | WebRTC SDP 解剖台：拆开 offer/answer 的每条媒体、编解码器、头部扩展与 ICE 候选，把候选优先级按 RFC 8445 反解成类型优先/本地优先/组件号，核对 offer 与 answer 的 m 行顺序、mid、方向互补、DTLS 角色与载荷类型交集，另附体检与一键脱敏（抹掉地址、ICE 口令、DTLS 指纹与流标识），离线可用。 |
| [MetronomeForge](https://wangzifan396-wzf.github.io/WB/tools/MetronomeForge/) ⭐ | 实用计算 | 节拍器：可调 BPM 与拍号，支持重音与前瞻调度内核，Tap 测速，辅助练习节奏，离线可用。 |
| [PaletteForge](https://wangzifan396-wzf.github.io/WB/tools/PaletteForge/) ⭐ | 设计工具 | 配色生成器：色相旋转派生互补/三角/邻近/单色方案，WCAG 对比度校验，点选即复制，离线可用。 |
| [ChordForge](https://wangzifan396-wzf.github.io/WB/tools/ChordForge/) ⭐ | 实用计算 | 和弦与音阶：和弦识别、音阶构建、音名解析与异名同音归一。 |
| [SnakeForge](https://wangzifan396-wzf.github.io/WB/tools/SnakeForge/) ⭐ | 数据结构 | 贪吃蛇：纯逻辑内核（移动/进食/墙撞/自撞）+ Canvas 游戏，方向键操作。 |
| [FractalForge](https://wangzifan396-wzf.github.io/WB/tools/FractalForge/) ⭐ | 实用计算 | 分形生成：Mandelbrot 点阵 / Koch 曲线 / Sierpinski 三角。 |
| [StateForge](https://wangzifan396-wzf.github.io/WB/tools/StateForge/) ⭐ | 开发辅助 | 有限状态机：定义/事件推演/可达性/死状态检测。 |
| [MurmurForge](https://wangzifan396-wzf.github.io/WB/tools/MurmurForge/) ⭐ | 编码加密 | MurmurHash3 x86_32 哈希：UTF-8 输入、自定义种子、分桶路由。 |
| [Base32Forge](https://wangzifan396-wzf.github.io/WB/tools/Base32Forge/) ⭐ | 编码加密 | Base32 编解码：RFC4648 / Base32Hex / Crockford / z-base-32 四变体。 |
| [VarintForge](https://wangzifan396-wzf.github.io/WB/tools/VarintForge/) ⭐ | 编码加密 | protobuf varint + ZigZag 变长整数编解码，hex 字节流互转。 |
| [GeohashForge](https://wangzifan396-wzf.github.io/WB/tools/GeohashForge/) ⭐ | 实用计算 | Geohash 编解码 + 8 邻居 + 包围盒，地理索引经典网格。 |
| [BenchForge](https://wangzifan396-wzf.github.io/WB/tools/BenchForge/) ⭐ | 开发辅助 | 基准统计：mean/median/MAD/P95 + 离群点检测 + A/B 速度比。 |
| [DistForge](https://wangzifan396-wzf.github.io/WB/tools/DistForge/) ⭐ | 文本处理 | 字符串距离六合一：Levenshtein/Damerau/Hamming/Jaro-Winkler/Dice。 |
| [MinhashForge](https://wangzifan396-wzf.github.io/WB/tools/MinhashForge/) ⭐ | 数据结构 | MinHash 签名 + Jaccard 估计：文档去重的核心草图。 |
| [SimhashForge](https://wangzifan396-wzf.github.io/WB/tools/SimhashForge/) ⭐ | 数据结构 | SimHash 64 位指纹 + 海明距离，近重复文本检测。 |
| [BktreeForge](https://wangzifan396-wzf.github.io/WB/tools/BktreeForge/) ⭐ | 数据结构 | BK 树容错查找：编辑距离三角不等式剪枝，拼写纠错索引。 |
| [SkipForge](https://wangzifan396-wzf.github.io/WB/tools/SkipForge/) ⭐ | 数据结构 | 跳表：种子化分层可复现，O(log n) 查找/插入/区间（Redis zset 内核）。 |
| [HuffmanForge](https://wangzifan396-wzf.github.io/WB/tools/HuffmanForge/) ⭐ | 编码加密 | 霍夫曼熵编码压缩器：基于字符频率的最优前缀码，无损还原。 |
| [CrcForge](https://wangzifan396-wzf.github.io/WB/tools/CrcForge/) ⭐ | 编码加密 | CRC 校验和：CRC-32 与 CRC-16/CCITT 数据完整性校验。 |
| [Base58Forge](https://wangzifan396-wzf.github.io/WB/tools/Base58Forge/) ⭐ | 编码加密 | Base58 编解码器：Bitcoin 字母表，紧凑防误读字节编码。 |
| [MatrixForge](https://wangzifan396-wzf.github.io/WB/tools/MatrixForge/) ⭐ | 实用计算 | 线性代数：矩阵加法 / 乘法 / 转置 / 行列式 / 逆矩阵。 |
| [TomlForge](https://wangzifan396-wzf.github.io/WB/tools/TomlForge/) ⭐ | 数据工具 | TOML 解析器：字符串/数值/数组/表/数组表，零依赖解析。 |
| [HeapForge](https://wangzifan396-wzf.github.io/WB/tools/HeapForge/) ⭐ | 数据结构 | 二叉堆：最小/最大堆，可持久化插入与弹出，堆排序。 |
| [DijkstraForge](https://wangzifan396-wzf.github.io/WB/tools/DijkstraForge/) ⭐ | 数据结构 | Dijkstra 最短路径：非负权重图单源最短路与路径还原。 |
| [AhoForge](https://wangzifan396-wzf.github.io/WB/tools/AhoForge/) ⭐ | 数据结构 | Aho-Corasick 多模式匹配：一次扫描命中多串（含重叠）。 |
| [QsForge](https://wangzifan396-wzf.github.io/WB/tools/QsForge/) ⭐ | 开发辅助 | URL 查询串：解析 / 序列化，重复键转数组，解码空格。 |
| [IniForge](https://wangzifan396-wzf.github.io/WB/tools/IniForge/) ⭐ | 数据工具 | INI 配置解析：section/键值/注释，与序列化互逆。 |
| [BaseForge](https://wangzifan396-wzf.github.io/WB/tools/BaseForge/) | 实用计算 | 进制转换增强版：大整数（BigInt）、小数部分、自定义字符表（base62/58）、2–36 进制。 |
| [DrawForge](https://wangzifan396-wzf.github.io/WB/tools/DrawForge/) ⭐ | 可视化 | 离线白板：手绘风画笔、矩形、椭圆、箭头、文本，自由平移缩放，一键导出 PNG/SVG，自动本地保存。 |
| [GraphForge](https://wangzifan396-wzf.github.io/WB/tools/GraphForge/) ⭐ | 可视化 | 离线 Mermaid 图表编辑器：写 DSL 实时预览，一键导出 SVG/PNG，零依赖、数据永不离机。 |
| [APIForge](https://wangzifan396-wzf.github.io/WB/tools/APIForge/) ⭐ | 开发辅助 | 离线 REST / GraphQL 客户端：请求构建、Bearer/Basic 鉴权、响应计时与体积、历史记录，零依赖。 |
| [ChatForge](https://wangzifan396-wzf.github.io/WB/tools/ChatForge/) ⭐ | AI 工具 | 本地优先 BYOK AI 对话：自带密钥直连 OpenAI/Anthropic/OpenRouter，流式输出，密钥永不离机。 |
| [FlowForge](https://wangzifan396-wzf.github.io/WB/tools/FlowForge/) | 效率工具 | 本地优先离线看板：多看板、拖拽排序、标签/优先级/截止、清单子任务，数据留在浏览器。 |
| [FormForge](https://wangzifan396-wzf.github.io/WB/tools/FormForge/) | 效率工具 | 本地优先离线表单构建器：拖拽式字段、实时预览，一键导出独立 HTML 或 JSON Schema。 |
| [FocusForge](https://wangzifan396-wzf.github.io/WB/tools/FocusForge/) | 效率工具 | 本地优先的专注与计时工具箱：番茄钟、倒计时、秒表、世界时钟，数据留在浏览器。 |
| [NanoBox](https://wangzifan396-wzf.github.io/WB/tools/NanoBox/) | 聚合器 | 单文件工具中枢：模糊搜索全部 nano-tools，内联安全表达式计算器，一键在 iframe 中打开。本地优先、零依赖。 |
| [SQLForge](https://wangzifan396-wzf.github.io/WB/tools/SQLForge/) ⭐ | 数据工具 | 离线 SQL 数据库客户端：基于 SQLite(WASM) 运行真实 SQL，导入 CSV/JSON 建表，结果导出 CSV/JSON，零依赖、数据永不离机。 |
| [DeckForge](https://wangzifan396-wzf.github.io/WB/tools/DeckForge/) ⭐ | 效率工具 | Markdown 一键变幻灯片：实时预览、键盘翻页、全屏演示、打印导出 PDF。离线、零依赖。 |
| [QRForge](https://wangzifan396-wzf.github.io/WB/tools/QRForge/) ⭐ | 编码加密 | 纯前端二维码生成器：文本/网址/WiFi/名片，可调容错与配色，导出 SVG 与 PNG。真离线、零依赖。 |
| [VaultForge](https://wangzifan396-wzf.github.io/WB/tools/VaultForge/) ⭐ | 安全工具 | 本地优先的零知识加密密码库：AES-GCM + PBKDF2，登录/卡片/笔记/身份全加密，数据永不出端。 |
| [MindForge](https://wangzifan396-wzf.github.io/WB/tools/MindForge/) ⭐ | 可视化 | 本地优先思维导图编辑器：结构化节点树、自动布局、分支配色，导出 PNG/SVG/JSON，离线可用。 |
| [SnipForge](https://wangzifan396-wzf.github.io/WB/tools/SnipForge/) ⭐ | 效率工具 | 本地优先的代码片段管理器：分类、标签、全文搜索，一键复制，JSON 导入导出，离线可用。 |
| [PlanForge](https://wangzifan396-wzf.github.io/WB/tools/PlanForge/) ⭐ | 效率工具 | 本地优先甘特图 / 路线图规划器：任务、依赖、里程碑、进度追踪，导出 PNG/SVG/JSON，离线可用。 |
| [FontForge](https://wangzifan396-wzf.github.io/WB/tools/FontForge/) ⭐ | 设计工具 | 字体预览与排版样张工作台：拖入字体即时渲染，调节字号 / 行高 / 字距 / 字重，字形表与可移植样张导出，本地优先。 |
| [ImageForge](https://wangzifan396-wzf.github.io/WB/tools/ImageForge/) ⭐ | 设计工具 | 离线图片编辑器：裁剪、缩放、旋转翻转、亮度 / 对比度 / 饱和度 / 色相 / 模糊调整、滤镜，导出 PNG/JPEG/WebP，零上传。 |
| [AudioForge](https://wangzifan396-wzf.github.io/WB/tools/AudioForge/) ⭐ | 图像工具 | 离线音频编辑器：加载音频、波形预览、裁剪、增益、淡入淡出、归一化、反转，导出 WAV，零上传。 |
| [A11yForge](https://wangzifan396-wzf.github.io/WB/tools/A11yForge/) ⭐ | 开发辅助 | 离线无障碍工具箱：WCAG 对比度检查、合规取色、色盲模拟、HTML/ARIA 审计，零上传。 |
| [JwtForge](https://wangzifan396-wzf.github.io/WB/tools/JwtForge/) ⭐ | 编码加密 | 离线 JWT / Token 解码器：拆分 header、payload、signature，可读化 exp/nbf/iat，不校验签名。 |
| [PromptForge](https://wangzifan396-wzf.github.io/WB/tools/PromptForge/) ⭐ | AI 工具 | 本地优先 AI Prompt 工作台：变量模板、实时预览、BYOK 直连大模型、Token 与成本估算、本地历史，密钥永不离机。 |
| [PDFForge](https://wangzifan396-wzf.github.io/WB/tools/PDFForge/) ⭐ | 图像工具 | 本地优先 PDF 工具箱：合并、拆分、旋转、重排、优化重存，文件永不上传。 |
| [TableForge](https://wangzifan396-wzf.github.io/WB/tools/TableForge/) ⭐ | 数据工具 | 离线表格工作台：粘贴 CSV/TSV/JSON 即解析，单元格编辑、增删行列、排序、筛选、分组聚合，导出 Markdown/HTML/JSON/CSV/TSV。 |
| [CVForge](https://wangzifan396-wzf.github.io/WB/tools/CVForge/) ⭐ | 效率工具 | 离线简历 / CV 工作台：结构化表单 + 实时预览，三种模板，一键打印导出 PDF，JSON 导入导出，数据留本地。 |
| [KanbanForge](https://wangzifan396-wzf.github.io/WB/tools/KanbanForge/) ⭐ | 效率工具 | 离线看板：多列拖拽卡片，优先级 / 标签 / 搜索筛选，导出 Markdown / JSON，数据永不离机。 |
| [InvoiceForge](https://wangzifan396-wzf.github.io/WB/tools/InvoiceForge/) ⭐ | 效率工具 | 离线发票 / 报价单生成器：行项目自动计税、人民币大写金额、A4 实时预览、一键打印导出 PDF。 |
| [TimeForge](https://wangzifan396-wzf.github.io/WB/tools/TimeForge/) | 实用计算 | 时间工具箱：Unix 时间戳 ⇄ 日期互转（自动识别秒/毫秒），6 时区对照，日期差与人性化时长计算。 |
| [UuidForge](https://wangzifan396-wzf.github.io/WB/tools/UuidForge/) ⭐ | 编码加密 | 离线 UUID / nanoid 生成器：v4 随机、v7 时间有序、v5 命名空间哈希（可复现）、批量生成与校验，数据永不离机。 |
| [SubnetForge](https://wangzifan396-wzf.github.io/WB/tools/SubnetForge/) ⭐ | 网络 | 离线 IPv4/IPv6 CIDR 子网计算器：网络/广播地址、可用主机范围、子网拆分与归属判断，零上传。 |
| [EnvForge](https://wangzifan396-wzf.github.io/WB/tools/EnvForge/) | 实用计算 | 离线 .env 解析 / 对比 / 校验器：变量引用展开、两份配置差异、必填项校验，纯本地。 |
| [UrlForge](https://wangzifan396-wzf.github.io/WB/tools/UrlForge/) ⭐ | 网络 | 离线 URL 工具箱：解析、编码/解码、查询参数构建与排序、Slug 生成、规范化，零上传。 |
| [CaseForge](https://wangzifan396-wzf.github.io/WB/tools/CaseForge/) | 文本处理 | 离线文本大小写转换与行工具：camelCase/snake_case/kebab-case 等、去重、排序、加前缀与行号。 |
| [YamlForge](https://wangzifan396-wzf.github.io/WB/tools/YamlForge/) ⭐ | 数据工具 | 离线 YAML ⇄ JSON 转换器：块级映射/序列、嵌套、类型推断、带引号标量，零上传。 |
| [AuthForge](https://wangzifan396-wzf.github.io/WB/tools/AuthForge/) ⭐ | 编码加密 | 离线 TOTP 身份验证器：自写 SHA1/HMAC-SHA1/RFC6238，生成 2FA 动态验证码与密钥，数据永不离机。 |
| [CryptoForge](https://wangzifan396-wzf.github.io/WB/tools/CryptoForge/) ⭐ | 编码加密 | 本地 AES-GCM 加密与解密：Web Crypto + PBKDF2 派生密钥、随机盐与 IV 打包，敏感数据不出本机。 |
| [BarcodeForge](https://wangzifan396-wzf.github.io/WB/tools/BarcodeForge/) ⭐ | 设计工具 | 离线一维条码生成器：Code 128 / EAN-13 / UPC-A（含校验位），矢量 SVG 导出，零依赖。 |
| [LicenseForge](https://wangzifan396-wzf.github.io/WB/tools/LicenseForge/) | 编码加密 | 离线开源许可证生成器：MIT/BSD-3-Clause/ISC/Apache-2.0/Unlicense 全文，填充年份与版权人。 |
| [GitignoreForge](https://wangzifan396-wzf.github.io/WB/tools/GitignoreForge/) | 编码加密 | 离线 .gitignore 模板组合器：21 种语言/框架/编辑器模板多选合并，带注释头，一键下载。 |
| [ExifForge](https://wangzifan396-wzf.github.io/WB/tools/ExifForge/) | 设计工具 | 离线图片 EXIF 元数据查看与清除：解析 JPEG APP1 / TIFF IFD，一键剥离拍摄隐私信息。 |
| [LoremForge](https://wangzifan396-wzf.github.io/WB/tools/LoremForge/) | 文本处理 | 离线 Lorem ipsum 占位文本生成器：可复现种子、段落/句数可调、可选 Lorem 开头与纯词数模式。 |
| [CsvForge](https://wangzifan396-wzf.github.io/WB/tools/CsvForge/) ⭐ | 数据工具 | 离线 CSV 工具箱：解析 / 转 JSON / 转置 / 概览，零上传。 |
| [CipherForge](https://wangzifan396-wzf.github.io/WB/tools/CipherForge/) ⭐ | 安全工具 | 离线经典密码：凯撒 / 维吉尼亚 / ROT13 / Atbash，数据不出本机。 |
| [AsciiForge](https://wangzifan396-wzf.github.io/WB/tools/AsciiForge/) ⭐ | 文本处理 | 离线 ASCII 艺术：A-Z 0-9 点阵横幅 / 文本框 / 黑客语转换。 |
| [AvatarForge](https://wangzifan396-wzf.github.io/WB/tools/AvatarForge/) | 设计工具 | 离线身份图标：种子文本生成确定性 identicon（SVG），零上传。 |
| [FaviconForge](https://wangzifan396-wzf.github.io/WB/tools/FaviconForge/) | 设计工具 | 离线 Favicon 生成：文字 / Emoji → SVG，自定义配色。 |
| [XmlForge](https://wangzifan396-wzf.github.io/WB/tools/XmlForge/) | 数据工具 | 离线 XML 工具：格式化缩进 / 结构校验（标签匹配闭合）。 |
| [HtmlForge](https://wangzifan396-wzf.github.io/WB/tools/HtmlForge/) | 开发辅助 | 离线 HTML 工具：压缩 / 格式化 / 转义反转义，零依赖。 |
| [TimerForge](https://wangzifan396-wzf.github.io/WB/tools/TimerForge/) | 实用计算 | 离线秒表 / 倒计时：精确到 0.1 秒，支持秒或 mm:ss 输入。 |
| [TypeForge](https://wangzifan396-wzf.github.io/WB/tools/TypeForge/) ⭐ | 开发辅助 | 离线 JSON → TypeScript 接口生成：嵌套对象展开、数组联合类型推断，零上传。 |
| [GradientForge](https://wangzifan396-wzf.github.io/WB/tools/GradientForge/) | 设计工具 | 离线 CSS 渐变构建器：线性 / 径向 / 锥形，多色标实时预览，一键复制 CSS。 |
| [LinesForge](https://wangzifan396-wzf.github.io/WB/tools/LinesForge/) | 文本处理 | 离线文本行工具箱：去重 / 排序 / 删空行 / 加行号 / 反转，实时统计。 |
| [HttpForge](https://wangzifan396-wzf.github.io/WB/tools/HttpForge/) | 网络 | 离线 HTTP 速查：状态码（1xx-5xx 可搜索）/ 请求方法特性 / 常见 MIME 类型。 |
| [UnicodeForge](https://wangzifan396-wzf.github.io/WB/tools/UnicodeForge/) | 编码加密 | 离线 Unicode 检查器：文本 ↔ \\uXXXX 转义、码点 U+、UTF-8 字节、HTML 实体互转。 |
| [ChmodForge](https://wangzifan396-wzf.github.io/WB/tools/ChmodForge/) | 开发辅助 | 离线 UNIX 权限计算器：八进制 ↔ rwx 符号互转，支持 setuid/setgid/sticky。 |
| [DockerForge](https://wangzifan396-wzf.github.io/WB/tools/DockerForge/) | 开发辅助 | 离线 docker run → docker-compose.yml 转换：支持 30+ 参数，YAML 安全转义。 |
| [CurlForge](https://wangzifan396-wzf.github.io/WB/tools/CurlForge/) | 网络 | 离线 curl 命令生成器：method / headers / body / 认证可视化配置，粘贴即用。 |
| [MetaForge](https://wangzifan396-wzf.github.io/WB/tools/MetaForge/) | 开发辅助 | 离线 Meta 标签生成器：基础 + Open Graph + Twitter Card 全套，SEO 长度检查。 |
| [UAForge](https://wangzifan396-wzf.github.io/WB/tools/UAForge/) | 网络 | 离线 User-Agent 解析器：浏览器 / 内核 / 系统 / 设备类型识别，含爬虫检测。 |
| [DiffForge](https://wangzifan396-wzf.github.io/WB/tools/DiffForge/) ⭐ | 文本处理 | 离线文本差异对比：基于 LCS 的行级 diff + 并排视图，统计增删，内置逐字符 inline diff。 |
| [ShotForge](https://wangzifan396-wzf.github.io/WB/tools/ShotForge/) ⭐ | 开发辅助 | 离线代码截图生成器：轻量语法高亮 + 仿 macOS 窗口外观，一键复制 SVG / 导出 2x PNG。 |
| [TotpForge](https://wangzifan396-wzf.github.io/WB/tools/TotpForge/) ⭐ | 编码加密 | 离线 TOTP 身份验证器：纯 JS HMAC-SHA1（RFC 4226/6238 验证），Base32/ASCII 密钥，实时倒计时。 |
| [HexForge](https://wangzifan396-wzf.github.io/WB/tools/HexForge/) ⭐ | 编码加密 | 离线十六进制查看器：文本(UTF-8)/十六进制/本地文件 → xxd 格式 dump，数据不出本机。 |
| [BookForge](https://wangzifan396-wzf.github.io/WB/tools/BookForge/) ⭐ | 网络 | 离线书签生成器：粘贴 JavaScript 一键生成可拖入书签栏的 javascript: 书签，支持反向解析与语法校验。 |
| [StatusForge](https://wangzifan396-wzf.github.io/WB/tools/StatusForge/) ⭐ | 网络 | 离线 HTTP 状态码速查：覆盖 1xx–5xx 共 60+ 状态码，支持数字 / 关键词搜索与分类筛选。 |
| [EmojiForge](https://wangzifan396-wzf.github.io/WB/tools/EmojiForge/) ⭐ | 文本处理 | 离线 emoji 速查：120+ 常用 emoji，按关键词或分组搜索，点击即复制并显示 Unicode 码位。 |
| [WordForge](https://wangzifan396-wzf.github.io/WB/tools/WordForge/) ⭐ | 文本处理 | 离线文本统计：字符 / 词数 / 行数 / 句子 / 段落 / 阅读时长 + 高频英文词，中英文混排友好。 |
| [StructForge](https://wangzifan396-wzf.github.io/WB/tools/StructForge/) ⭐ | 开发辅助 | 离线结构生成：粘贴 JSON 一键转 TypeScript interface / Go struct / Python dataclass / JSON Schema，嵌套自动拆分。 |
| [SlugForge](https://wangzifan396-wzf.github.io/WB/tools/SlugForge/) ⭐ | 文本处理 | 离线 URL Slug 生成：变音符折叠（é→e、ß→ss）、可配置分隔符 / 大小写 / 长度，支持批量。 |
| [GlobForge](https://wangzifan396-wzf.github.io/WB/tools/GlobForge/) ⭐ | 开发辅助 | 离线 Glob 模式测试：支持 * / ** / ? / [abc] / {a,b}，对一批路径实时匹配并统计命中数。 |
| [RomanForge](https://wangzifan396-wzf.github.io/WB/tools/RomanForge/) ⭐ | 文本处理 | 离线罗马数字：阿拉伯数字 ↔ 罗马数字互转，支持规范形校验，范围 1–3999。 |
| [TempForge](https://wangzifan396-wzf.github.io/WB/tools/TempForge/) ⭐ | 文本处理 | 离线温度换算：摄氏度 / 华氏度 / 开尔文 / 兰氏度四标度互转，实时计算。 |
| [MathForge](https://wangzifan396-wzf.github.io/WB/tools/MathForge/) ⭐ | 开发辅助 | 离线数学表达式求值：安全无 eval，支持 + - * / ^ % 括号、函数与常量。 |
| [MimeForge](https://wangzifan396-wzf.github.io/WB/tools/MimeForge/) ⭐ | 开发辅助 | 离线 MIME 类型查询：扩展名 ↔ MIME 双向，内置 ~70 条常用映射，可扩展。 |
| [MorseForge](https://wangzifan396-wzf.github.io/WB/tools/MorseForge/) ⭐ | 文本处理 | 离线莫尔斯电码：文本 ↔ 电码互转，自动识别方向，内置完整速查表可点击输入。 |
| [KeyForge](https://wangzifan396-wzf.github.io/WB/tools/KeyForge/) ⭐ | 开发辅助 | 离线键盘按键侦测：实时显示 key / code / keyCode / 修饰键组合，支持键码反查。 |
| [LuhnForge](https://wangzifan396-wzf.github.io/WB/tools/LuhnForge/) ⭐ | 开发辅助 | 离线 Luhn 校验：银行卡号模 10 校验、卡组织识别（Visa/银联等）、校验位补全。 |
| [DiagramForge](https://wangzifan396-wzf.github.io/WB/tools/DiagramForge/) ⭐ | 可视化 | 离线流程图编辑器：节点+连线结构化绘图，4 种形状、拖拽连线、撤销重做、自动布局，导出 SVG/JSON。 |
| [CodeForge](https://wangzifan396-wzf.github.io/WB/tools/CodeForge/) ⭐ | 开发辅助 | 离线前端游乐场：HTML/CSS/JS 三栏编辑 + 沙箱 iframe 实时预览 + 控制台捕获，可导出独立 HTML。 |
| [PixelForge](https://wangzifan396-wzf.github.io/WB/tools/PixelForge/) ⭐ | 图像工具 | 离线像素画 / 精灵图编辑器：画笔、橡皮、填充、取色、直线、矩形、X 轴镜像、网格缩放、24 色调色板、动画帧+洋葱皮+FPS 预览，导出 PNG@Nx 与雪碧图，localStorage 多项目管理。 |
| [GIFForge](https://wangzifan396-wzf.github.io/WB/tools/GIFForge/) ⭐ | 图像工具 | 离线 GIF 动画制作器：拖入图片或雪碧图切片成帧，拖拽排帧、逐帧延时、循环与抖动控制，纯 JS GIF89a 编码器（LZW+中位切分量化）本地导出。 |
| [MeshForge](https://wangzifan396-wzf.github.io/WB/tools/MeshForge/) ⭐ | 图像工具 | 离线 3D 模型查看器：拖入 OBJ / STL（二进制/ASCII 自动识别），WebGL 轨道渲染，着色/线框/点云三模式，坐标轴+网格+AABB 自动取景，PNG 快照导出。 |
| [RegexForge](https://wangzifan396-wzf.github.io/WB/tools/RegexForge/) ⭐ | 开发辅助 | 离线正则测试与可视化：实时匹配高亮、捕获组与命名组、铁路图结构、速查表，一键导出匹配 JSON。 |
| [WhiteboardForge](https://wangzifan396-wzf.github.io/WB/tools/WhiteboardForge/) ⭐ | 设计工具 | 离线无限画布白板：矩形/椭圆/线/箭头/自由笔/文字/便签，平移缩放、撤销重做、本地自动保存，导出 PNG 与 SVG。 |
| [SchemaForge](https://wangzifan396-wzf.github.io/WB/tools/SchemaForge/) ⭐ | 开发辅助 | 离线数据库建模 / ER 图设计器：可视化建表、外键关联，导出 MySQL / PostgreSQL / SQLite 多方言 SQL DDL 与 Mermaid。 |
| [ChartForge](https://wangzifan396-wzf.github.io/WB/tools/ChartForge/) ⭐ | 数据工具 | 离线数据图表生成器：粘贴 CSV / JSON / TSV，生成柱状 / 折线 / 饼 / 环形 / 散点 / 面积图，Canvas 渲染并导出 PNG 与 SVG。 |
| [BeautifyForge](https://wangzifan396-wzf.github.io/WB/tools/BeautifyForge/) ⭐ | 开发辅助 | 离线代码美化与压缩：JavaScript / CSS / HTML / JSON 格式化与精简，字符串 / 注释 / 正则感知的 tokenizer，支持自动识别语言与实时字符统计。 |
| [SheetForge](https://wangzifan396-wzf.github.io/WB/tools/SheetForge/) ⭐ | 数据工具 | 离线迷你电子表格：A1 引用、区域、SUM / AVG / IF / ROUND 等公式引擎，依赖图重算与环检测，CSV 导入导出，零依赖。 |
| [TypingForge](https://wangzifan396-wzf.github.io/WB/tools/TypingForge/) ⭐ | 效率工具 | 离线打字速度测试：WPM / CPM / 准确率 / 稳定性，逐字符实时高亮，15/30/60 秒模式，可复现词表与本地最佳记录。 |
| [DateForge](https://wangzifan396-wzf.github.io/WB/tools/DateForge/) ⭐ | 效率工具 | 离线日期计算器：日期间隔（年月日精确拆分）、加减推算、ISO 周 / 年积日 / 工作日、年龄与下次生日，纯整数序列算法无时区陷阱。 |
| [SemverForge](https://wangzifan396-wzf.github.io/WB/tools/SemverForge/) ⭐ | 开发辅助 | 离线 SemVer 2.0.0 工具箱：版本解析校验、优先级比较排序、范围匹配（^ ~ x.* || 连字符）、bump 七种递增策略与版本差异判定。 |
| [HabitForge](https://wangzifan396-wzf.github.io/WB/tools/HabitForge/) ⭐ | 效率工具 | 离线习惯追踪器：每日打卡、当前 / 最长连击、近 30 天完成率、半年热力图，数据只存本地，支持 JSON 导入导出。 |
| [JsonPathForge](https://wangzifan396-wzf.github.io/WB/tools/JsonPathForge/) ⭐ | 数据工具 | 离线 JSONPath 查询器：自研解析器支持 $ . .. [*] [n] [切片] [?(@.x op v)] 过滤与正则匹配，实时高亮命中、输出规范化路径。 |
| [NginxForge](https://wangzifan396-wzf.github.io/WB/tools/NginxForge/) ⭐ | 开发辅助 | 离线 Nginx 配置生成器：静态 / SPA / 反向代理 / 负载均衡四预设，HTTPS / HTTP2 / gzip / 安全头 / WebSocket / 限流一键生成，先校验后产出。 |
| [ColorBlindForge](https://wangzifan396-wzf.github.io/WB/tools/ColorBlindForge/) ⭐ | 设计工具 | 离线色觉障碍模拟器：Machado 三型 + 全色盲模拟，sRGB↔Lab 转换、WCAG 对比度与 ΔE 审计，调色板无障碍检查。 |
| [KeypairForge](https://wangzifan396-wzf.github.io/WB/tools/KeypairForge/) ⭐ | 编码加密 | 密钥对工作台：浏览器内用 WebCrypto 生成 Ed25519 / X25519 / P-256·384·521 / RSA 2048·3072·4096 密钥对，自动切成 OpenSSH 公钥、PEM 公钥(SPKI)、PEM 私钥(PKCS#8)、JWK 公钥/私钥、DER hex 六种形态，算出 SSH / JWK(RFC 7638) / SPKI Pin / X.509 SKI 四套指纹，支持粘贴现有密钥解析、配对校验与逐算法 openssl/ssh-keygen 命令速查，离线可用、私钥不离开标签页。 |
| [SshForge](https://wangzifan396-wzf.github.io/WB/tools/SshForge/) ⭐ | 编码加密 | OpenSSH 公钥工坊：粘贴单行公钥、authorized_keys 或 known_hosts（多行混排也能认），本地算出 SHA-256/MD5 指纹、drunken-bishop randomart 与密钥类型，并指出每行所属格式；支持把任意两个条目做配对校验，判断它们是否同源，全部离线、不上传任何数据。 |
| [JwkForge](https://wangzifan396-wzf.github.io/WB/tools/JwkForge/) ⭐ | 编码加密 | JWK / JWKS 工坊：手写实现 JWK 与 JWKS 的解析、规范化与 RFC 7638 指纹，识别 Ed25519 / X25519 / P-256·384·521 / RSA / OKP 等密钥类型，并把 JWK 与 PEM（SPKI 公钥、PKCS#8 私钥）及 DER hex 双向转换，PEM 的 ASN.1 DER 完全在本机手写编解码，离线可用。 |
| [JwsForge](https://wangzifan396-wzf.github.io/WB/tools/JwsForge/) ⭐ | 编码加密 | JWS 工作台：手写实现 RFC 7515 的紧凑与 JSON（general / flattened）序列化解析，支持 detached 载荷；用 JWK 验签 HS256/384/512、RS256/384/512、ES256/384/512（RSA-PSS 提示走浏览器端 WebCrypto），并用私钥 JWK 签发上述算法的紧凑 JWS，全部纯 JS 同步、不依赖 WebCrypto、离线可用。 |
| [TldrForge](https://wangzifan396-wzf.github.io/WB/tools/TldrForge/) ⭐ | 效率工具 | TLDR 速查台：内置 40+ 常用 CLI 命令（git/docker/ssh/nginx 等）的简版手册，支持关键词搜索、分类浏览与用法示例一键复制，离线可用。 |
| [Pbkdf2Forge](https://wangzifan396-wzf.github.io/WB/tools/Pbkdf2Forge/) ⭐ | 编码加密 | PBKDF2 派生台：纯 JS 手写 RFC 2898 的 PBKDF2（SHA-1/SHA-256），对照 RFC 6070 与 RFC 7914 向量自检，生成盐、估算迭代强度并给出 OWASP 2023 建议，离线可用。 |
| [SpectroForge](https://wangzifan396-wzf.github.io/WB/tools/SpectroForge/) ⭐ | 音频工具 | 声谱台：纯 JS 手写 radix-2 FFT，把解码后的音频转成波形与频谱图（Hann 窗、热力色带），可拖入本地音频文件实时分析，离线可用。 |
| [CarbonForge](https://wangzifan396-wzf.github.io/WB/tools/CarbonForge/) ⭐ | 图像工具 | 代码卡片生成器：把 JS/Python/Bash/JSON/HTML 片段渲染成 macOS 窗口风格的 SVG 代码卡片，支持语言高亮、明暗主题与一键导出 SVG/PNG，离线可用。 |
| [SamlForge](https://wangzifan396-wzf.github.io/WB/tools/SamlForge/) ⭐ | 安全工具 | SAML 解码台：粘贴 SAML Response（XML 或 base64），解析 Issuer、NameID、有效期、Audience 与属性声明，校验签名与时间窗，离线可用。 |
| [OtpForge](https://wangzifan396-wzf.github.io/WB/tools/OtpForge/) ⭐ | 安全工具 | TOTP 生成台：纯 JS 实现 RFC 6238 / 4226，从 Base32 密钥或 otpauth:// URI 生成动态口令，带时钟容错窗口与倒计时，离线可用。 |
| [CborForge](https://wangzifan396-wzf.github.io/WB/tools/CborForge/) ⭐ | 编码加密 | CBOR 编解码台：RFC 8949 调试器，十六进制字节与结构化值互相转换，支持数组/映射/字节串/标签/浮点，离线可用。 |
| [CvssForge](https://wangzifan396-wzf.github.io/WB/tools/CvssForge/) ⭐ | 安全工具 | CVSS 评分计算器：按 CVSS v3.1 / v4.0 指标（AV/AC/PR/UI/S/C/I/A 与 v4 新增的 MSI/CR 等）实时计算基础分、临时分与严重等级（无/低/中/高/严重），并生成可复用的向量串。评估漏洞优先级、撰写安全报告时一目了然，零依赖、离线可用。 |
| [SbomForge](https://wangzifan396-wzf.github.io/WB/tools/SbomForge/) ⭐ | 安全工具 | SBOM 工具：粘贴依赖清单（npm/pip/yarn 锁文件或自定义列表），生成 CycloneDX 或 SPDX 格式的软件物料清单，标注组件名称/版本/PURL/许可证与依赖关系，并检测已知弱点模式。梳理供应链、满足合规与审计要求，零依赖、离线可用。 |
| [TerraformForge](https://wangzifan396-wzf.github.io/WB/tools/TerraformForge/) ⭐ | 开发辅助 | Terraform/HCL 辅助台：解析与格式化 Terraform 配置，校验 provider/resource/variable 引用一致性，展开 module 调用与 count/for_each，统计资源数与 provider 分布。调试 IaC、做变更前评审的好帮手，零依赖、离线可用。 |
| [ActionsForge](https://wangzifan396-wzf.github.io/WB/tools/ActionsForge/) ⭐ | 开发辅助 | GitHub Actions 检查器：粘贴 workflow YAML，解析 jobs/steps/needs/触发事件与 secrets 引用，校验步骤依赖图是否有环、矩阵与缓存配置是否合理，并提示常见反模式（如把密钥直接 echo 到日志）。评审 CI/CD 配置、排查流水线失败，零依赖、离线可用。 |
| [LogqlForge](https://wangzifan396-wzf.github.io/WB/tools/LogqlForge/) ⭐ | 开发辅助 | LogQL 工作台：解析并解释 Loki 查询，拆解日志流选择器、标签过滤、管线（| line_format / | json / | label_format）与指标查询（rate/sum by），也可通过表单可视化拼装查询。排查日志告警、学习 LogQL 的利器，零依赖、离线可用。 |
| [WasmForge](https://wangzifan396-wzf.github.io/WB/tools/WasmForge/) ⭐ | 编码加密 | WebAssembly 工具：解析 .wasm 二进制模块，列出自定义段、类型/函数/导入/导出/代码段与数据段，反汇编导出函数为可读的 WAT 片段，并校验魔数（\0asm）与版本。调试 Wasm 模块、理解二进制结构，纯 JS 实现、零依赖、离线可用。 |
| [AvroForge](https://wangzifan396-wzf.github.io/WB/tools/AvroForge/) ⭐ | 编码加密 | Avro 工具：解析 Avro 模式（record/enum/union/逻辑类型），计算解析规范形式（PCF）与 64 位 Rabin 指纹，编码/解码单对象（single-object）与二进制容器，并评估模式演进兼容性（FULL/BACKWARD/FORWARD）。调试 Kafka/数据流水线中的 Avro 载荷，零依赖、离线可用。 |
| [OtelForge](https://wangzifan396-wzf.github.io/WB/tools/OtelForge/) ⭐ | 开发辅助 | OpenTelemetry 工具：粘贴 OTLP/JSON 的 resourceSpans，解析资源/作用域/span 结构，构建调用链父子树、定位关键路径与慢调用、计算错误率与 P50/P95/P99 延迟，并按最新语义约定（如 http.request.method、url.full）校验埋点质量与凭据泄露风险。排查分布式链路、做 SLO 评审，零依赖、离线可用。 |
| [CircuitForge](https://wangzifan396-wzf.github.io/WB/tools/CircuitForge/) ⭐ | 开发辅助 | 熔断器工作台：配置滑动窗口、错误率与慢调用阈值、最小调用数与半开探测量，逐条回放请求序列，推演 Closed/Open/HalfOpen 状态机的跳闸时刻与恢复过程，并给出参数体检与整改建议。设计 Resilience4j/Sentinel/Hystrix 风格熔断策略、复盘雪崩事故的利器，零依赖、离线可用。 |
| [BalancerForge](https://wangzifan396-wzf.github.io/WB/tools/BalancerForge/) ⭐ | 开发辅助 | 负载均衡实验台：定义后端节点与权重，对比平滑加权轮询（SWRR）、最少连接、P2C 二选一与一致性哈希环的分流结果，量化各节点命中分布与不均衡度，并模拟增删节点时一致性哈希的键迁移比例。选型网关分流算法、评估扩缩容抖动，零依赖、离线可用。 |
| [SloForge](https://wangzifan396-wzf.github.io/WB/tools/SloForge/) ⭐ | 计算工具 | SLO 错误预算计算器：输入可用性目标（99.9% 或 three nines）与统计窗口，换算成允许的停机时长与失败请求数，按实际流量计算错误预算消耗比例、燃尽速率与预计耗尽时刻，并生成 Google SRE 多窗口多燃尽率（MWMBR）告警阈值表。做 SLO 评审、配置告警规则的利器，零依赖、离线可用。 |
| [QueueForge](https://wangzifan396-wzf.github.io/WB/tools/QueueForge/) ⭐ | 计算工具 | 排队论容量计算器：输入到达率、服务时间与并发工作单元数，用 M/M/1、M/M/c、Erlang B/Erlang C 模型算出利用率、排队概率、平均等待与端到端延迟，并用通用扩展律（USL）拟合吞吐随并发增长的拐点。做容量规划、判断该加机器还是降延迟，零依赖、离线可用。 |
| [GrpcForge](https://wangzifan396-wzf.github.io/WB/tools/GrpcForge/) ⭐ | 开发辅助 | gRPC 工具箱：查询全部 17 个状态码及其 HTTP 映射与可重试性，双向解析 grpc-timeout 头并推演多跳截止时间传播预算，把十六进制载荷拆成长度前缀帧并按 protobuf 线格式列出字段编号与类型，还能体检 retryPolicy 的退避配置与重试放大倍数。调试 gRPC 调用链、设计重试策略，零依赖、离线可用。 |
| [AsyncapiForge](https://wangzifan396-wzf.github.io/WB/tools/AsyncapiForge/) ⭐ | 开发辅助 | AsyncAPI 校验器：粘贴 YAML 或 JSON 文档，自动识别 3.0 与 2.x 代际，校验 info/servers/channels/operations 必填项、地址风格与重复、send|receive 语义、消息载荷与 $ref 断引用，绘制服务与频道的发布订阅拓扑，并给出 2.x 升级 3.0 的逐项改写提示。评审事件驱动契约、排查消息通道配置，零依赖、离线可用。 |
| [OauthForge](https://wangzifan396-wzf.github.io/WB/tools/OauthForge/) ⭐ | 安全工具 | OAuth 2.1 体检台：粘贴授权请求 URL，逐项校验 response_type、redirect_uri、state 与 scope，用内置纯 JS SHA-256 真实计算并验证 PKCE 的 code_challenge（S256），解析令牌响应与 JWT 载荷（不验签）检查 alg=none 与过期，并按客户端类型推荐合规流程。排查登录集成、评审授权安全，零依赖、离线可用。 |
| [TimeoutForge](https://wangzifan396-wzf.github.io/WB/tools/TimeoutForge/) ⭐ | 开发辅助 | 超时预算规划器：按行录入调用链每一跳的超时、P99 延迟、重试次数与退避间隔，逐层核对是否存在下游超时大于上游的倒挂，计算最坏耗时与重试放大倍数，自顶向下分配超时预算，并按 P99 反推推荐超时值，同时给出 Google SRE 重试预算与对冲请求建议。治理级联超时、防重试风暴，零依赖、离线可用。 |

| [FlashcardForge](https://wangzifan396-wzf.github.io/WB/tools/FlashcardForge/) | 教育工具 | 把任意「正面||背面」文本变成可点击翻转的复习闪卡，支持乱序与本地保存。 |
| [SpellBeeForge](https://wangzifan396-wzf.github.io/WB/tools/SpellBeeForge/) | 教育工具 | 给出中文含义，练习英文拼写并即时校验。 |
| [AnagramForge](https://wangzifan396-wzf.github.io/WB/tools/AnagramForge/) | 文本处理 | 输入单词，从内置词库找出所有变位词（字母重排）。 |
| [EchoForge](https://wangzifan396-wzf.github.io/WB/tools/EchoForge/) | 音频工具 | 为上传的音频添加可调节延迟与衰减的回声，离线处理并导出 WAV。 |
| [ReverbForge](https://wangzifan396-wzf.github.io/WB/tools/ReverbForge/) | 音频工具 | 用合成脉冲响应为音频添加空间混响，离线卷积并导出 WAV。 |
| [MockupForge](https://wangzifan396-wzf.github.io/WB/tools/MockupForge/) | 设计工具 | 给截图套上手机/平板/笔记本/桌面设备外框，一键导出 PNG。 |
| [PosterForge](https://wangzifan396-wzf.github.io/WB/tools/PosterForge/) | 设计工具 | 输入标题与点缀色，离线生成简洁海报并导出 PNG。 |
| [GravityForge](https://wangzifan396-wzf.github.io/WB/tools/GravityForge/) | 科学工具 | 计算两物体引力、星球表面重力、近地轨道速度与跨星球体重。 |
| [MetaphorForge](https://wangzifan396-wzf.github.io/WB/tools/MetaphorForge/) | 创意工具 | 随机组合生成富有诗意的隐喻句，可复现。 |
| [LimerickForge](https://wangzifan396-wzf.github.io/WB/tools/LimerickForge/) | 创意工具 | 生成五句打油诗，结构工整、可复现。 |
| [FableForge](https://wangzifan396-wzf.github.io/WB/tools/FableForge/) | 创意工具 | 生成带寓意的短篇寓言，动物与场景随机组合。 |
| [BlessingForge](https://wangzifan396-wzf.github.io/WB/tools/BlessingForge/) | 创意工具 | 随机组合生成温暖的中文祝福语，可复现。 |
| [QuizForge](https://wangzifan396-wzf.github.io/WB/tools/QuizForge/) | 教育工具 | 把「题干||选项A||选项B…||答案」文本变成可判分的测验，支持乱序与本地保存。 |
| [VocabForge](https://wangzifan396-wzf.github.io/WB/tools/VocabForge/) | 教育工具 | 词汇卡：录入「单词||释义」，随机抽测、拼写与选择双模式、本地保存。 |
| [LearnForge](https://wangzifan396-wzf.github.io/WB/tools/LearnForge/) | 教育工具 | 间隔重复学习器：六档间隔盒子（0/1/3/7/16/30 天）自动推进，到期提醒，离线可用。 |
| [MathQuizForge](https://wangzifan396-wzf.github.io/WB/tools/MathQuizForge/) | 教育工具 | 生成可复现的四则运算与方程练习题及答案，可调难度与数量。 |
| [TypeScaleForge](https://wangzifan396-wzf.github.io/WB/tools/TypeScaleForge/) | 设计工具 | 排版比例标尺：黄金比/小调三度等经典比例一键生成字号阶梯，实时预览。 |
| [LogoForge](https://wangzifan396-wzf.github.io/WB/tools/LogoForge/) | 设计工具 | 文字 Logo 工作台：选字体风格、字距与配色，离线生成可复制/下载的 SVG。 |
| [PaletteFromImgForge](https://wangzifan396-wzf.github.io/WB/tools/PaletteFromImgForge/) | 设计工具 | 从图片取色板：中位切分算法抽主色，离线处理、不传服务器。 |
| [EquationForge](https://wangzifan396-wzf.github.io/WB/tools/EquationForge/) | 数学工具 | 解一元一次方程与一元二次方程，给出判别式与步骤。 |
| [ModForge](https://wangzifan396-wzf.github.io/WB/tools/ModForge/) | 数学工具 | 模运算工具箱：模逆、模幂与中国剩余定理（CRT）求解。 |
| [SalaryForge](https://wangzifan396-wzf.github.io/WB/tools/SalaryForge/) | 财务工具 | 月薪计算器：累进个税、五险一金估算，算清到手工资。 |
| [InvestmentForge](https://wangzifan396-wzf.github.io/WB/tools/InvestmentForge/) | 财务工具 | 投资复利计算器：定投/一次性投入的未来值与增长表。 |
| [GratuityForge](https://wangzifan396-wzf.github.io/WB/tools/GratuityForge/) | 财务工具 | 离职补偿（N+1）计算器：按司龄分段（前 5 年 21 天/年、其后 30 天/年）算补偿月数。 |
| [GeoQuizForge](https://wangzifan396-wzf.github.io/WB/tools/GeoQuizForge/) | 教育工具 | 地理测验：看国家答首都、看首都答国家、看国旗答国家，内置国题库，计分乱序。 |
| [TimesTableForge](https://wangzifan396-wzf.github.io/WB/tools/TimesTableForge/) | 教育工具 | 口算练习：加减乘除按难度出题，计时正确率并回顾错题。 |
| [MistakeBookForge](https://wangzifan396-wzf.github.io/WB/tools/MistakeBookForge/) | 教育工具 | 错题本：记录题目与错答，按标签分类，本地保存可删除与复习。 |
| [ConjugateForge](https://wangzifan396-wzf.github.io/WB/tools/ConjugateForge/) | 教育工具 | 英语不规则动词变位练习：内置词库，随机抽测过去式/过去分词。 |
| [FormulaForge](https://wangzifan396-wzf.github.io/WB/tools/FormulaForge/) | 教育工具 | 数学/物理公式速查：面积体积速度三角函数等，离线内置库分类检索。 |
| [GrammarForge](https://wangzifan396-wzf.github.io/WB/tools/GrammarForge/) | 教育工具 | 英语语法练习：冠词/时态/单复数选择题，内置题库即时判分解析。 |
| [DictationForge](https://wangzifan396-wzf.github.io/WB/tools/DictationForge/) | 教育工具 | 听写练习：浏览器朗读英文单词，用户输入校对，内置词库可复现。 |
| [CodeQuizForge](https://wangzifan396-wzf.github.io/WB/tools/CodeQuizForge/) | 教育工具 | 编程/CS 概念测验：算法/网络/数据库等，内置题库随机抽题判分。 |
| [ConstForge](https://wangzifan396-wzf.github.io/WB/tools/ConstForge/) | 科学工具 | 物理/数学/天文常数速查：符号数值单位，离线内置库。 |
| [ComboForge](https://wangzifan396-wzf.github.io/WB/tools/ComboForge/) | 数学工具 | 排列组合与概率：阶乘、排列、组合数与二项分布概率。 |
| [SeriesForge](https://wangzifan396-wzf.github.io/WB/tools/SeriesForge/) | 数学工具 | 数列求和：等差/等比数列通项与前 n 项和。 |
| [RandomForge](https://wangzifan396-wzf.github.io/WB/tools/RandomForge/) | 实用计算 | 随机工具：随机整数、名单抽奖、掷骰子，可复现种子。 |
| [IpConvForge](https://wangzifan396-wzf.github.io/WB/tools/IpConvForge/) | 网络 | IPv4 进制转换：点分/整数/二进制/十六进制互转，判定类别与作用域。 |
| [PortForge](https://wangzifan396-wzf.github.io/WB/tools/PortForge/) | 网络 | 端口速查：35 个知名 TCP/UDP 端口，按端口号或服务名搜索、按协议过滤。 |
| [CidrForge](https://wangzifan396-wzf.github.io/WB/tools/CidrForge/) | 网络 | CIDR 计算：网络/广播地址、掩码、通配符、可用主机范围与数量。 |
| [VlsmForge](https://wangzifan396-wzf.github.io/WB/tools/VlsmForge/) | 网络 | VLSM 划分：按主机需求（从大到小）变长子网划分。 |
| [BandwidthForge](https://wangzifan396-wzf.github.io/WB/tools/BandwidthForge/) | 网络 | 传输估算：文件大小与网速估算传输耗时。 |
| [StudyPlanForge](https://wangzifan396-wzf.github.io/WB/tools/StudyPlanForge/) | 教育工具 | 学习计划：目标日倒计时与每日轮转科目排期。 |
| [SpellForge](https://wangzifan396-wzf.github.io/WB/tools/SpellForge/) | 教育工具 | 拼写测验：中英词义提示练英文拼写，内置词库。 |
| [ScoreForge](https://wangzifan396-wzf.github.io/WB/tools/ScoreForge/) | 教育工具 | 成绩统计：数量/总分/平均分/最高最低/及格率/加权。 |
| [MoleculeForge](https://wangzifan396-wzf.github.io/WB/tools/MoleculeForge/) | 科学工具 | 分子量：解析化学式按元素周期表算摩尔质量。 |
| [WaterForge](https://wangzifan396-wzf.github.io/WB/tools/WaterForge/) | 健康工具 | 饮水目标：按体重与活动量估算每日饮水与杯数。 |
| [KarnaughForge](https://wangzifan396-wzf.github.io/WB/tools/KarnaughForge/) | 数学工具 | 卡诺图化简：Quine-McCluskey 算法化简布尔最小项。 |
| [TruthTableForge](https://wangzifan396-wzf.github.io/WB/tools/TruthTableForge/) | 数学工具 | 真值表：布尔表达式生成完整真值表。 |
| [Ipv6Forge](https://wangzifan396-wzf.github.io/WB/tools/Ipv6Forge/) | 网络 | IPv6 解析：压缩/展开、前缀长度、地址类型判定（环回/链路本地/唯一本地/多播）。 |
| [MacGeneratorForge](https://wangzifan396-wzf.github.io/WB/tools/MacGeneratorForge/) | 网络 | MAC 生成：随机 / EUI-64 / 指定 OUI，大小写与分隔符可选。 |
| [IpRangeForge](https://wangzifan396-wzf.github.io/WB/tools/IpRangeForge/) | 网络 | IP 范围：起止地址、可用数量、是否包含、按段拆分。 |
| [OhmsForge](https://wangzifan396-wzf.github.io/WB/tools/OhmsForge/) | 实用计算 | 欧姆定律：电压 / 电流 / 电阻 / 功率，任意三个求第四个。 |
| [IdealGasForge](https://wangzifan396-wzf.github.io/WB/tools/IdealGasForge/) | 科学工具 | 理想气体：PV=nRT，求压强 / 体积 / 温度 / 摩尔数。 |
| [GcdForge](https://wangzifan396-wzf.github.io/WB/tools/GcdForge/) | 数学工具 | 最大公约数与最小公倍数：多整数 GCD / LCM。 |
| [StatsForge](https://wangzifan396-wzf.github.io/WB/tools/StatsForge/) | 数学工具 | 描述统计：均值 / 中位数 / 众数 / 方差 / 标准差 / 极差 / 求和。 |
| [ShapeForge](https://wangzifan396-wzf.github.io/WB/tools/ShapeForge/) | 数学工具 | 面积周长：矩形 / 正方形 / 圆 / 三角形 / 梯形 / 椭圆 / 正多边形。 |
| [AmortizeForge](https://wangzifan396-wzf.github.io/WB/tools/AmortizeForge/) | 财务工具 | 等额本息：月供、总利息、本金利息逐期拆分表。 |
| [SavingsForge](https://wangzifan396-wzf.github.io/WB/tools/SavingsForge/) | 财务工具 | 储蓄目标：定期定额未来值、达成目标所需月数。 |
| [ReturnForge](https://wangzifan396-wzf.github.io/WB/tools/ReturnForge/) | 财务工具 | 投资回报：ROI、回本周期、盈亏平衡点与毛利率。 |
| [BmiCalcForge](https://wangzifan396-wzf.github.io/WB/tools/BmiCalcForge/) | 健康工具 | BMI 计算：按身高体重算 BMI 并给健康区间判定。 |

## 快速使用

1. **在线用**：打开 [门户](https://wangzifan396-wzf.github.io/WB/)，点任意工具卡即达。
2. **离线用**：进入 `tools/<ToolName>/`，下载 `index.html`，双击打开即可。
3. **整仓拿**：`git clone https://github.com/wangzifan396-wzf/WB.git`，全部工具一次到手。
4. **自托管**：把整个仓库丢到任何静态服务器（或 `python -m http.server`）。

## 质量保障

- 每个工具都带 `_test.js`（纯函数断言）+ `smoke.js`（jsdom 冒烟）。
- 发布前双门禁：`audit_render.js`（渲染/语法/截断）与 `audit_matrix_v3.py`（运行时缺陷）必须 0 缺陷。
- 工具总数与分类实时取自门户 `index.html` 的 `TOOLS` 数组（当前 1010 款 / 22 类）；本矩阵为精选展示，随新批次手工补充。

## 聚合工作台

想在一个标签页里切换全部工具？打开 [nano-workbench](https://wangzifan396-wzf.github.io/nano-workbench/)。

## License

MIT — 你拥有全部源码。
