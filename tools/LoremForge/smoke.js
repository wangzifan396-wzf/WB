/* jsdom smoke test — DOM mounts, pure API exposed, generate populates output. */
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
  ok('LoremForgePure exposed', typeof window.LoremForgePure === 'object');
  ok('gen button present', !!doc.getElementById('gen'));
  ok('out present', !!doc.getElementById('out'));
  ok('auto-render text', /Lorem ipsum/.test(doc.getElementById('out').textContent));
  ok('no js errors', errs.length === 0);
  if (errs.length) console.error('  js errors:', errs);
  console.log('LoremForge smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 500);
