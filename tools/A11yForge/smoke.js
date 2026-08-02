/* jsdom smoke test — DOM mounts, pure API exposed, audit runs without errors. */
const { JSDOM } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
const { window } = dom;
const errs = [];
window.addEventListener('error', e => errs.push(e.message));

setTimeout(() => {
  const doc = window.document;
  let pass = 0, fail = 0;
  const ok = (n, c) => c ? pass++ : (fail++, console.error('  FAIL: ' + n));
  ok('A11yForgePure exposed', typeof window.A11yForgePure === 'object');
  ok('ratio element present', !!doc.getElementById('ratioNum'));
  ok('badges rendered', doc.getElementById('badges').children.length === 4);
  ok('cvd swatches rendered', doc.getElementById('cvdSwatches').children.length > 0);
  ok('run audit populates issues', (() => {
    doc.getElementById('htmlIn').value = '<img src="x.png"><input id="e">';
    doc.getElementById('auditBtn').click();
    return doc.getElementById('issues').children.length > 0;
  })());
  ok('no js errors', errs.length === 0);
  if (errs.length) console.error('  js errors:', errs);
  console.log('A11yForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 400);
