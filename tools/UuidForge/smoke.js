// UuidForge smoke.js — mount the page in jsdom and exercise the UI.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('PASS',name);} else {fail++;console.error('FAIL',name);} }

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
const { window } = dom;
const doc = window.document;

ok('mode segmented control present', !!doc.getElementById('mode'));
ok('generate button present', !!doc.getElementById('gen'));
ok('output container present', !!doc.getElementById('out'));

// default generation (v4 x5) should populate output
const items = doc.querySelectorAll('#out .item');
ok('default gen produced 5 items', items.length === 5);

// switch to v5 and regenerate
const v5btn = doc.querySelector('#mode button[data-m="v5"]');
v5btn.click();
ok('v5 box shown', doc.getElementById('v5box').classList.contains('show'));
doc.getElementById('nm').value = 'python.org';
doc.getElementById('gen').click();
const v5val = doc.querySelector('#out .item .val').textContent;
ok('v5 produced python.org vector', v5val === '886313e1-3b8a-5372-9b90-0c9aee199e5d');

// validate
doc.getElementById('check').value = '886313e1-3b8a-5372-9b90-0c9aee199e5d';
doc.getElementById('chk').click();
ok('validator reports valid', /合法/.test(doc.getElementById('chkres').textContent));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
