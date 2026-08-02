/* DateForge jsdom 冒烟测试 */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const IGNORE = /(navigator\.serviceWorker|Not implemented|localStorage)/i;

const vc = new (require('jsdom').VirtualConsole)();
vc.on('jsdomError', (e) => { if (!IGNORE.test(String(e))) console.error('jsdomError:', e.message); });

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'https://example.com/', virtualConsole: vc });
const { window } = dom;
const { document } = window;

let failed = 0;
function ok(cond, name) {
  if (cond) console.log('  ok ' + name);
  else { failed++; console.error('  FAIL ' + name); }
}

ok(!!window.__DATEFORGE__, '内核钩子 window.__DATEFORGE__ 存在');
ok(typeof window.__DATEFORGE__.diffDays === 'function', 'diffDays 可调用');

/* 日期间隔 */
document.getElementById('diffA').value = '2026-01-01';
document.getElementById('diffB').value = '2026-12-31';
document.getElementById('diffGo').click();
const diffRes = document.getElementById('diffRes');
ok(!diffRes.classList.contains('hide'), '间隔结果面板显示');
ok(diffRes.textContent.indexOf('364') >= 0, '间隔天数 364 正确渲染');

/* Tab 切换 + 日期加减 */
document.getElementById('tabCalc').click();
ok(!document.getElementById('pane-calc').classList.contains('hide'), 'Tab 切换到加减面板');
document.getElementById('calcBase').value = '2026-01-31';
document.getElementById('calcN').value = '1';
document.getElementById('calcUnit').value = 'm';
document.getElementById('calcGo').click();
ok(document.getElementById('calcRes').textContent.indexOf('2026-02-28') >= 0, '1/31+1月=2/28 渲染');

/* 日期信息 */
document.getElementById('tabInfo').click();
document.getElementById('infoD').value = '2026-07-27';
document.getElementById('infoGo').click();
const infoTxt = document.getElementById('infoRes').textContent;
ok(infoTxt.indexOf('周一') >= 0, '2026-07-27 星期一');
ok(infoTxt.indexOf('31') >= 0, 'ISO 第 31 周');

/* 年龄 */
document.getElementById('tabAge').click();
document.getElementById('ageBirth').value = '2000-02-29';
document.getElementById('ageRef').value = '2026-07-27';
document.getElementById('ageGo').click();
const ageTxt = document.getElementById('ageRes').textContent;
ok(ageTxt.indexOf('26 岁') >= 0, '闰日出生 26 岁');
ok(ageTxt.indexOf('2027-02-28') >= 0, '下次生日收敛 2/28');

console.log(failed ? 'SMOKE FAIL (' + failed + ')' : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
