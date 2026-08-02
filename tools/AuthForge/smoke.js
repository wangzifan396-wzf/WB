/* jsdom smoke test — DOM mounts, pure API exposed, verify populates output. */
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
  ok('AuthForgePure exposed', typeof window.AuthForgePure === 'object');
  ok('verify button present', !!doc.getElementById('verify'));
  ok('code element present', !!doc.getElementById('code'));
  ok('verify populates code', (() => {
    doc.getElementById('secret').value = 'JBSWY3DPEHPK3PXP';
    doc.getElementById('verify').click();
    var t = doc.getElementById('code').textContent;
    return /^\d{6}$/.test(t);
  })());
  ok('gen produces valid secret', (() => {
    doc.getElementById('gen').click();
    return window.AuthForgePure.validateSecret(doc.getElementById('secret').value);
  })());
  ok('no js errors', errs.length === 0);
  if (errs.length) console.error('  js errors:', errs);
  console.log('AuthForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 500);
