# PigForge

猪拉丁（Pig Latin）翻译器：把英文单词按规则转换成 Pig Latin——元音开头的词加 “way”，其余把开头辅音簇移到词尾再加 “ay”，并保留大小写，玩文字游戏或教学演示时随手可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/PigForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
