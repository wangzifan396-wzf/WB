/* JsonPathForge jsdom 冒烟测试 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const IGNORE = /(navigator\.serviceWorker|Not implemented|localStorage|clipboard)/i;
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { if (!IGNORE.test(String(e))) console.error('jsdomError:', e.message); });

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com/', virtualConsole: vc });
const { window } = dom;
const { document } = window;

let failed = 0;
function ok(cond, name) { if (cond) console.log('  ok ' + name); else { failed++; console.error('  FAIL ' + name); } }

ok(!!window.__JSONPATHFORGE__, '内核钩子 window.__JSONPATHFORGE__ 存在');
ok(window.__JSONPATHFORGE__.query({ a: [1, 2] }, '$.a[-1]')[0] === 2, 'query 可调用');

/* 初始加载即执行了默认查询（price < 10 的 title）*/
const s0 = document.getElementById('qStats').textContent;
ok(s0.indexOf('2') >= 0, '默认查询命中 2 条');
ok(document.getElementById('qRes').textContent.indexOf('Moby Dick') >= 0, '结果含 Moby Dick');

/* 改路径重查 */
document.getElementById('pathIn').value = '$..author';
document.getElementById('queryGo').click();
ok(document.getElementById('qStats').textContent.indexOf('4') >= 0, '$..author 命中 4 条');
ok(document.getElementById('qRes').textContent.indexOf("$['store']['book'][0]['author']") >= 0, '规范化路径渲染');

/* 语法错误提示 */
document.getElementById('pathIn').value = 'oops';
document.getElementById('queryGo').click();
ok(document.getElementById('qStats').textContent.indexOf('路径语法错误') >= 0, '语法错误提示');

/* 坏 JSON 提示 */
document.getElementById('jsonIn').value = '{bad';
document.getElementById('pathIn').value = '$';
document.getElementById('queryGo').click();
ok(document.getElementById('qStats').textContent.indexOf('JSON 解析失败') >= 0, '坏 JSON 提示');

/* 载入示例恢复 */
document.getElementById('loadSample').click();
ok(document.getElementById('jsonIn').value.indexOf('Moby Dick') >= 0, '载入示例');

/* 示例 chip 点击 */
const chips = document.querySelectorAll('#exChips .chip');
chips[1].click(); /* $..author */
ok(document.getElementById('qStats').textContent.indexOf('4') >= 0, 'chip 点击触发查询');

/* tab 切换 */
document.getElementById('tabCheat').click();
ok(!document.getElementById('pane-cheat').classList.contains('hide'), '速查表 tab 可切换');

console.log(failed ? 'SMOKE FAIL (' + failed + ')' : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
