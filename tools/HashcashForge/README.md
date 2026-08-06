# HashcashForge

Hashcash 工作量证明：为某个资源（如邮箱）mint 一个带足够前导零位的 stamp，用于反垃圾邮件 / 算力证明演示。内置可验证哈希与难度校验，纯本地、零依赖。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/HashcashForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
