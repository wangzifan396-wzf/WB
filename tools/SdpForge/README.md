# SdpForge

WebRTC SDP 解剖台：拆开 offer/answer 的每条媒体、编解码器、头部扩展与 ICE 候选，把候选优先级按 RFC 8445 反解成类型优先/本地优先/组件号，核对 offer 与 answer 的 m 行顺序、mid、方向互补、DTLS 角色与载荷类型交集，另附体检与一键脱敏（抹掉地址、ICE 口令、DTLS 指纹与流标识），离线可用。

- 单文件 HTML，零依赖，打开即用
- 数据全程留在本机，不上传任何服务器
- 支持 PWA 安装与离线使用

## 在线使用

https://wangzifan396-wzf.github.io/WB/tools/SdpForge/

## 本地运行

直接用浏览器打开 `index.html` 即可。

## 测试

```bash
node _test.js   # 内核纯函数断言
node smoke.js   # jsdom 冒烟测试
```

## 工具矩阵

浏览全部工具：https://wangzifan396-wzf.github.io/WB/
