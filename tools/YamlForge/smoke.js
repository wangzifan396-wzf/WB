// YamlForge smoke.js — mount the page in jsdom and exercise the UI.
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('PASS',name);} else {fail++;console.error('FAIL',name);} }

const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' });
const { window } = dom;
const doc = window.document;

ok('yamlIn present', !!doc.getElementById('yamlIn'));
ok('toJson present', !!doc.getElementById('toJson'));
ok('jsonOut present', !!doc.getElementById('jsonOut'));

// default render populates jsonOut with parsed content
ok('yaml->json rendered', /"name":\s*"John"/.test(doc.getElementById('jsonOut').textContent));

ok('jsonIn present', !!doc.getElementById('jsonIn'));
ok('toYaml present', !!doc.getElementById('toYaml'));
ok('yamlOut present', !!doc.getElementById('yamlOut'));

// default render populates yamlOut
ok('json->yaml rendered', /name: John/.test(doc.getElementById('yamlOut').textContent));

// interactive: change input and convert
doc.getElementById('yamlIn').value = 'x: 1\ny:\n  - a\n  - b';
doc.getElementById('toJson').click();
ok('interactive yaml->json', /"x":\s*1/.test(doc.getElementById('jsonOut').textContent));

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
