/* HabitForge jsdom 冒烟测试 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const IGNORE = /(navigator\.serviceWorker|Not implemented|localStorage)/i;
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { if (!IGNORE.test(String(e))) console.error('jsdomError:', e.message); });

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com/', virtualConsole: vc });
const { window } = dom;
const { document } = window;

let failed = 0;
function ok(cond, name) { if (cond) console.log('  ok ' + name); else { failed++; console.error('  FAIL ' + name); } }

ok(!!window.__HABITFORGE__, '内核钩子 window.__HABITFORGE__ 存在');
ok(typeof window.__HABITFORGE__.currentStreak === 'function', 'currentStreak 可调用');

/* 初始空态 */
ok(document.querySelector('#habitList .empty') !== null, '初始空态提示');

/* 添加习惯 */
document.getElementById('habitName').value = '早起';
document.getElementById('addGo').click();
const cards = document.querySelectorAll('#habitList .habit');
ok(cards.length === 1, '添加后 1 张习惯卡');
ok(cards[0].textContent.indexOf('早起') >= 0, '习惯名渲染');
ok(cards[0].querySelector('.heat svg') !== null, '热力图 SVG 渲染');
ok(cards[0].querySelectorAll('.heat rect').length === 182, '热力图 182 格');

/* 打卡 */
document.querySelector('#habitList .chk').click();
ok(document.querySelector('#habitList .chk').classList.contains('done'), '打卡后勾选态');
ok(document.querySelector('#habitList .hb-meta').textContent.indexOf('连击 1 天') >= 0, '连击 1 天渲染');

/* 取消打卡 */
document.querySelector('#habitList .chk').click();
ok(!document.querySelector('#habitList .chk').classList.contains('done'), '取消打卡态');

/* localStorage 持久化 */
document.querySelector('#habitList .chk').click();
const raw = window.localStorage.getItem('habitforge-v1');
ok(raw && raw.indexOf('早起') >= 0, 'localStorage 已写入');

console.log(failed ? 'SMOKE FAIL (' + failed + ')' : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
