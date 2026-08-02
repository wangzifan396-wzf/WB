/* NginxForge 内核单测 */
'use strict';
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: 未找到内核 <script>'); process.exit(1); }
const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const NF = mod.exports;

let passed = 0, failed = 0;
function ok(cond, name) { if (cond) passed++; else { failed++; console.error('  FAIL: ' + name); } }
function has(s, sub, name) { ok(s.indexOf(sub) >= 0, name + ' (缺 "' + sub + '")'); }
function not(s, sub, name) { ok(s.indexOf(sub) < 0, name + ' (不应含 "' + sub + '")'); }
function throws(fn, name) { try { fn(); failed++; console.error('  FAIL(应抛错): ' + name); } catch (e) { passed++; } }

/* ---- presets / defaults ---- */
ok(Object.keys(NF.presets).length === 4, '4 个预设');
ok(NF.defaults('static').preset === 'static', 'defaults 预设名');
ok(NF.defaults('lb').upstreams.length === 2, 'lb 默认 2 个上游');

/* ---- validate ---- */
ok(NF.validate(NF.defaults('static')).length === 0, '默认 static 校验通过');
ok(NF.validate(Object.assign(NF.defaults('static'), { domain: '' })).length > 0, '空域名报错');
ok(NF.validate(Object.assign(NF.defaults('static'), { domain: 'bad domain' })).length > 0, '含空格域名报错');
ok(NF.validate(Object.assign(NF.defaults('static'), { root: 'relative/path' })).length > 0, '相对 root 报错');
ok(NF.validate(Object.assign(NF.defaults('proxy'), { upstreams: [] })).length > 0, 'proxy 无上游报错');
ok(NF.validate(Object.assign(NF.defaults('lb'), { upstreams: ['127.0.0.1:3000'] })).length > 0, 'lb 单上游报错');
ok(NF.validate(Object.assign(NF.defaults('static'), { https: true, certPath: '' })).length > 0, 'https 缺证书报错');
ok(NF.validate(Object.assign(NF.defaults('static'), { rateLimit: true, rateLimitRps: 0 })).length > 0, '限流 0 rps 报错');
ok(NF.validate(Object.assign(NF.defaults('static'), { clientMaxBody: '10 MB' })).length > 0, 'body size 格式报错');
ok(NF.validate(Object.assign(NF.defaults('proxy'), { upstreams: ['unix:/run/app.sock'] })).length === 0, 'unix socket 上游合法');
throws(() => NF.generate(Object.assign(NF.defaults('static'), { domain: '' })), 'generate 对无效配置抛错');

/* ---- static 预设 ---- */
const st = NF.generate(NF.defaults('static'));
has(st, 'listen 443 ssl;', 'static: 443 ssl');
has(st, 'http2 on;', 'static: http2 现代指令');
has(st, 'server_name example.com;', 'static: server_name');
has(st, 'return 301 https://example.com$request_uri;', 'static: 80 跳转');
has(st, 'root /var/www/html;', 'static: root');
has(st, 'try_files $uri $uri/ =404;', 'static: try_files 404');
has(st, 'gzip on;', 'static: gzip');
has(st, 'X-Content-Type-Options', 'static: 安全头');
has(st, 'Strict-Transport-Security', 'static: HSTS（https 下）');
has(st, 'expires 30d;', 'static: 资源缓存');
has(st, 'ssl_protocols TLSv1.2 TLSv1.3;', 'static: TLS 协议');
has(st, 'client_max_body_size 16m;', 'static: body size');
not(st, 'upstream', 'static: 无 upstream 块');
not(st, 'proxy_pass', 'static: 无 proxy_pass');

/* ---- http-only ---- */
const httpOnly = NF.generate(Object.assign(NF.defaults('static'), { https: false, http2: false, forceHttps: false }));
has(httpOnly, 'listen 80;', 'http-only: 80');
not(httpOnly, 'ssl_certificate', 'http-only: 无证书');
not(httpOnly, 'Strict-Transport-Security', 'http-only: 无 HSTS');
not(httpOnly, 'return 301', 'http-only: 无跳转');

/* ---- spa ---- */
const spa = NF.generate(NF.defaults('spa'));
has(spa, 'try_files $uri $uri/ /index.html;', 'spa: 回退 index.html');

/* ---- proxy ---- */
const px = NF.generate(Object.assign(NF.defaults('proxy'), { websocket: true, rateLimit: true, rateLimitRps: 20 }));
has(px, 'upstream backend {', 'proxy: upstream 块');
has(px, 'server 127.0.0.1:3000;', 'proxy: 上游 server');
has(px, 'proxy_pass http://backend;', 'proxy: proxy_pass');
has(px, 'proxy_set_header Host $host;', 'proxy: Host 头');
has(px, 'proxy_set_header X-Forwarded-Proto $scheme;', 'proxy: X-Forwarded-Proto');
has(px, 'proxy_http_version 1.1;', 'proxy: ws http/1.1');
has(px, 'proxy_set_header Upgrade $http_upgrade;', 'proxy: ws Upgrade');
has(px, 'proxy_set_header Connection "upgrade";', 'proxy: ws Connection');
has(px, 'limit_req_zone $binary_remote_addr zone=nf_rl:10m rate=20r/s;', 'proxy: 限流 zone');
has(px, 'limit_req zone=nf_rl burst=40 nodelay;', 'proxy: 限流 burst=2x');
not(px, 'root ', 'proxy: 无 root');

/* ---- lb ---- */
const lb = NF.generate(Object.assign(NF.defaults('lb'), { lbMethod: 'least_conn' }));
has(lb, 'least_conn;', 'lb: least_conn');
has(lb, 'server 127.0.0.1:3001;', 'lb: 第二上游');
has(lb, 'keepalive 32;', 'lb: keepalive');
const lbh = NF.generate(Object.assign(NF.defaults('lb'), { lbMethod: 'ip_hash' }));
has(lbh, 'ip_hash;', 'lb: ip_hash');
const lbr = NF.generate(NF.defaults('lb'));
not(lbr, 'least_conn', 'lb: 默认轮询无策略指令');
not(lbr, 'ip_hash', 'lb: 默认轮询无 ip_hash');

/* ---- 关闭开关 ---- */
const bare = NF.generate(Object.assign(NF.defaults('static'), { gzip: false, securityHeaders: false, cacheAssets: false }));
not(bare, 'gzip on;', '关 gzip');
not(bare, 'X-Frame-Options', '关安全头');
not(bare, 'expires 30d;', '关资源缓存');

/* ---- 结构完整性：花括号配平 ---- */
[st, httpOnly, spa, px, lb].forEach((conf, i) => {
  const open = (conf.match(/{/g) || []).length, close = (conf.match(/}/g) || []).length;
  ok(open === close && open > 0, '配置 ' + i + ' 花括号配平 (' + open + '/' + close + ')');
});

console.log('passed ' + passed + ', failed ' + failed);
process.exit(failed ? 1 : 0);
