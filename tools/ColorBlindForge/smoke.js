/* ColorBlindForge jsdom 冒烟测试 */
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

ok(!!window.__COLORBLINDFORGE__, '内核钩子 window.__COLORBLINDFORGE__ 存在');
ok(Math.abs(window.__COLORBLINDFORGE__.contrast('#000', '#fff') - 21) < 0.01, 'contrast 可调用');

/* 初始渲染：单色模拟 5 卡（原色 + 4 型） */
ok(document.querySelectorAll('#simRes .sw').length === 5, '单色模拟渲染 5 张色卡');
ok(document.getElementById('simRes').textContent.indexOf('Protanopia') >= 0, '含红色盲卡');

/* 改色重模拟 */
document.getElementById('simHex').value = '#00FF00';
document.getElementById('simGo').click();
ok(document.getElementById('simRes').textContent.indexOf('#00FF00') >= 0, '重模拟渲染新色');

/* 无效色提示 */
document.getElementById('simHex').value = 'zzz';
document.getElementById('simGo').click();
ok(document.getElementById('simRes').textContent.indexOf('无效 HEX') >= 0, '无效色提示');

/* 调色板审计：默认 5 色 × 5 视觉类型 */
document.getElementById('tabPal').click();
document.getElementById('palGo').click();
ok(document.querySelectorAll('#palRes .prow').length === 5, '审计渲染 5 个视觉类型行');
ok(document.querySelectorAll('#palRes .strip').length === 5, '5 条色带');
ok(document.getElementById('palRes').textContent.indexOf('Deuteranopia') >= 0, '含绿色盲行');

/* 红绿冲突调色板应出警告 */
document.getElementById('palIn').value = '#FF0000\n#00A000';
document.getElementById('palTh').value = '25';
document.getElementById('palGo').click();
ok(document.getElementById('palRes').textContent.indexOf('难以区分') >= 0, '红绿对被标记');

/* 对比度 */
document.getElementById('tabCtr').click();
document.getElementById('ctrFg').value = '#000000';
document.getElementById('ctrBg').value = '#FFFFFF';
document.getElementById('ctrGo').click();
ok(document.getElementById('ctrStats').textContent.indexOf('21.00 : 1') >= 0, '黑白 21:1');
ok(document.getElementById('ctrStats').textContent.indexOf('AAA') >= 0, 'AAA 等级');
ok(!document.getElementById('ctrPrev').classList.contains('hide'), '预览块显示');

console.log(failed ? 'SMOKE FAIL (' + failed + ')' : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
