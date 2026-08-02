# SshForge

OpenSSH 公钥工坊：粘贴单行公钥、authorized_keys 或 known_hosts（多行混排也能认），本地算出 SHA-256 / MD5 指纹、drunken-bishop randomart 与密钥类型，并指出每行属于哪种格式；支持把任意两个条目做配对校验，判断它们是否源自同一把密钥，全部离线、不上传任何数据。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SshForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
