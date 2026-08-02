# SpectroForge

音频波形与频谱图查看器：加载本地音频文件（或生成示例），纯函数计算振幅波形包络与基于短时傅里叶变换（FFT）的频谱图，直观看到频率成分随时间的变化，全部在浏览器内完成、不上传任何音频。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SpectroForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
