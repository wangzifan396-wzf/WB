# NginxForge · Nginx 配置生成器

> 单文件 · 零依赖 · 离线可用的 Nginx 配置生成器

**在线使用**: https://wangzifan396-wzf.github.io/WB/tools/NginxForge/

## 特性

- **四大预设**：静态站点 / SPA 单页应用（history 回退）/ 反向代理 / 负载均衡（round robin · least_conn · ip_hash + keepalive）
- **一键选项**：
  - HTTPS（TLSv1.2/1.3 + session cache）+ HTTP/2（现代 `http2 on;` 指令）+ 80→301 强制跳转
  - gzip 压缩（类型白名单 + min_length + vary）
  - 安全响应头（X-Frame-Options / nosniff / Referrer-Policy / Permissions-Policy / HSTS）
  - WebSocket 透传（Upgrade/Connection + 86400s read timeout）
  - 请求限流（`limit_req_zone` + burst=2x nodelay）
  - 静态资源 30d 缓存（immutable）
- **结构化校验**：域名 / root 绝对路径 / 上游地址（含 unix socket）/ 证书路径 / body size 全部先校验后生成
- 实时生成、复制、下载 `.conf`；localStorage 记忆；离线 PWA

## 本地使用

下载 `index.html` 双击打开即可。生成的配置放入 `/etc/nginx/conf.d/<域名>.conf`，`nginx -t` 验证后 `nginx -s reload`。

## 测试

```bash
node _test.js   # 内核单测（58 断言，含花括号配平检查）
node smoke.js   # jsdom UI 冒烟（需 jsdom）
```

## 内核 API

页面暴露 `window.__NGINXFORGE__`（Node 环境 `module.exports`）：

```js
NF.defaults('lb')        // → 预设默认配置对象
NF.validate(cfg)         // → 错误信息数组（空 = 通过）
NF.generate(cfg)         // → nginx.conf 字符串
NF.presets               // → 4 预设元数据
```

## 相关项目

nano-tools 系列 · [全部工具](https://wangzifan396-wzf.github.io/WB/)

## License

MIT
