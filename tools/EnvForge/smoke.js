// EnvForge smoke.js
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let pass=0, fail=0;
function ok(n,c){ if(c){pass++;console.log('PASS',n);} else {fail++;console.error('FAIL',n);} }

const dom = new JSDOM(html, { runScripts:'dangerously', url:'http://localhost/' });
const doc = dom.window.document;
ok('parse button', !!doc.getElementById('parse'));
ok('resolve button', !!doc.getElementById('resolve'));
ok('diff button', !!doc.getElementById('diff'));

doc.getElementById('parse').click();
ok('parse renders table', doc.querySelectorAll('#parseOut table tr').length===6);

doc.getElementById('resolve').click();
ok('resolve expands API_URL', /https:\/\/MyApp\.example\.com/.test(doc.getElementById('parseOut').textContent));

doc.getElementById('diff').click();
ok('diff reports removed C', /C/.test(doc.getElementById('parseOut').textContent) && /移除/.test(doc.getElementById('parseOut').textContent));

doc.getElementById('validate').click();
ok('validate ok (all present)', /全部必填项/.test(doc.getElementById('valOut').textContent));

console.log('\n'+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
