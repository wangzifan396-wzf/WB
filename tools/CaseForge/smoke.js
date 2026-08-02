// CaseForge smoke.js — mount the page in jsdom and exercise the UI.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('PASS',name);} else {fail++;console.error('FAIL',name);} }

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
const { window } = dom;
const doc = window.document;

ok('text present', !!doc.getElementById('text'));
ok('caseSel present', !!doc.getElementById('caseSel'));
ok('btnCase present', !!doc.getElementById('btnCase'));
ok('caseOut present', !!doc.getElementById('caseOut'));

doc.getElementById('text').value = 'hello world';
doc.getElementById('caseSel').value = 'camel';
doc.getElementById('btnCase').click();
ok('case convert to camel', doc.getElementById('caseOut').textContent === 'helloWorld');

ok('statOut populated', /字符/.test(doc.getElementById('statOut').textContent));

ok('lineInput present', !!doc.getElementById('lineInput'));
ok('btnLine present', !!doc.getElementById('btnLine'));
doc.getElementById('lineInput').value = 'c\na\nb';
doc.getElementById('lineOp').value = 'sort';
doc.getElementById('btnLine').click();
ok('line sort', doc.getElementById('lineOut').textContent === 'a\nb\nc');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
