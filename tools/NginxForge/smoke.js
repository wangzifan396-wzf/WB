/* NginxForge jsdom 冒烟测试 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const IGNORE = /(navigator\.serviceWorker|Not implemented|localStorage|clipboard|createObjectURL)/i;
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { if (!IGNORE.test(String(e))) console.error('jsdomError:', e.message); });

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com/', virtualConsole: vc });
const { window } = dom;
const { document } = window;

let failed = 0;
function ok(cond, name) { if (cond) console.log('  ok ' + name); else { failed++; console.error('  FAIL ' + name); } }

ok(!!window.__NGINXFORGE__, '内核钩子 window.__NGINXFORGE__ 存在');
ok(window.__NGINXFORGE__.generate(window.__NGINXFORGE__.defaults('spa')).indexOf('/index.html') >= 0, 'generate 可调用');

/* 初始渲染：static 预设 */
const out0 = document.getElementById('confOut').textContent;
ok(out0.indexOf('listen 443 ssl;') >= 0, '初始 static 配置含 443');
ok(out0.indexOf('try_files $uri $uri/ =404;') >= 0, 'static try_files');

/* 切 SPA */
document.getElementById('tabSpa').click();
ok(document.getElementById('confOut').textContent.indexOf('try_files $uri $uri/ /index.html;') >= 0, 'SPA 回退渲染');

/* 切负载均衡：自动补第二上游 + upstream 块 */
document.getElementById('tabLb').click();
const outLb = document.getElementById('confOut').textContent;
ok(outLb.indexOf('upstream backend {') >= 0, 'lb upstream 块');
ok(outLb.indexOf('127.0.0.1:3001') >= 0, 'lb 自动补第二上游');
ok(!document.getElementById('rowLb').classList.contains('hide'), 'lb 策略选择器可见');

/* 改域名即时重渲染 */
document.getElementById('tabProxy').click();
const dIn = document.getElementById('fDomain');
dIn.value = 'api.foo.dev';
dIn.dispatchEvent(new window.Event('input'));
ok(document.getElementById('confOut').textContent.indexOf('server_name api.foo.dev;') >= 0, '域名联动重渲染');

/* 非法域名显示错误 */
dIn.value = 'bad domain';
dIn.dispatchEvent(new window.Event('input'));
ok(!document.getElementById('errBox').classList.contains('hide'), '非法域名报错显示');
ok(document.getElementById('confOut').textContent === '', '报错时清空输出');

/* WebSocket 选项 */
dIn.value = 'ws.foo.dev';
dIn.dispatchEvent(new window.Event('input'));
const ws = document.getElementById('oWs');
ws.checked = true;
ws.dispatchEvent(new window.Event('change'));
ok(document.getElementById('confOut').textContent.indexOf('proxy_set_header Upgrade $http_upgrade;') >= 0, 'WebSocket 头渲染');

console.log(failed ? 'SMOKE FAIL (' + failed + ')' : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
