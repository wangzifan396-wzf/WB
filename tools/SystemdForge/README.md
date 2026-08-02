# SystemdForge

systemd unit 助手：按表单生成带安全加固项的 service 与 timer 文件并附安装命令；校验模式内置 20+ 条检查，覆盖相对路径、sudo、结尾 &、非法 Restart 与缺失 Install 等错误。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SystemdForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
