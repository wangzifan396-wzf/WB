/* jsdom smoke test — DOM mounts, pure API exposed, no js errors on load. */
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
  ok('ExifForgePure exposed', typeof window.ExifForgePure === 'object');
  ok('file input present', !!doc.getElementById('file'));
  ok('drop present', !!doc.getElementById('drop'));
  ok('strip button present', !!doc.getElementById('strip'));
  ok('no js errors', errs.length === 0);
  if (errs.length) console.error('  js errors:', errs);
  console.log('ExifForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 500);
