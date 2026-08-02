# SortForge

排序算法观察站 —— 单文件、零依赖、本地优先。五大经典排序逐帧留痕，比较 / 移动次数一键横评，讲课与刷题的直觉神器。

- `stSort(arr, alg)`：bubble / insertion / selection / quick(Lomuto) / merge，输出 sorted + comparisons + moves + frames（快照轨迹，输入不可变）。
- 冒泡带提前退出（已序数组仅 n-1 次比较 0 移动）；选择排序恒 n(n-1)/2 次比较。
- `stCompare(arr)`：五算法同数据横评。
- `stSvg(frames)`：排序前后柱状对比 SVG。

## 测试
```
node _test.js
node smoke.js
```
