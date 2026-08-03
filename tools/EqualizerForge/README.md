# EqualizerForge

10 段音频均衡器：基于 Web Audio BiquadFilter 的实时均衡器，内置 Flat/Rock/Pop/Vocal/Bass 预设；CORE 提供 dB→线性增益换算与预设数据，纯函数可测。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/EqualizerForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
