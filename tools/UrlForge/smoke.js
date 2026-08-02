// UrlForge smoke.js — mount the page in jsdom and exercise the UI.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('PASS',name);} else {fail++;console.error('FAIL',name);} }

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
const { window } = dom;
const doc = window.document;

ok('urlInput present', !!doc.getElementById('urlInput'));
ok('btnParse present', !!doc.getElementById('btnParse'));
ok('parseOut present', !!doc.getElementById('parseOut'));

// default parse runs on load
ok('parseOut populated', /example\.com/.test(doc.getElementById('parseOut').textContent));

// query encode
doc.getElementById('qEncInput').value = 'a=1\nb=hello world';
doc.getElementById('btnEnc').click();
ok('encode produces percent', /hello%20world/.test(doc.getElementById('qEncOut').textContent));

// slugify
doc.getElementById('slugInput').value = 'Hello World';
doc.getElementById('btnSlug').click();
ok('slugify output', doc.getElementById('slugOut').textContent === 'hello-world');

// build url
doc.getElementById('bHost').value = 'demo.test';
doc.getElementById('btnBuild').click();
ok('build url output', /https:\/\/demo\.test/.test(doc.getElementById('bOut').textContent));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
