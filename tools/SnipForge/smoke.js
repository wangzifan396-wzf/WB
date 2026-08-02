/* SnipForge — jsdom smoke test (no crypto, no canvas).
 *
 * Loads index.html with runScripts:'dangerously', captures any fatal
 * jsdomError, and asserts the app boots with 0 fatal errors and a known
 * root element present.
 */
const fs = require('fs');
const path = require('path');
const JSDOM = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom').JSDOM;
const VirtualConsole = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom').VirtualConsole;

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const vc = new VirtualConsole();
let err = 0;
vc.on('jsdomError', (e) => {
  err++;
  console.log('  jsdomError: ' + (e && e.message ? e.message : e));
});

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc
});

// Give scripts (incl. DOMContentLoaded -> init) a moment to run.
setTimeout(() => {
  const doc = dom.window.document;
  // Known root / structural elements that must exist after a successful boot.
  const root = doc.getElementById('app')
    || doc.getElementById('sidebar')
    || doc.getElementById('list')
    || doc.querySelector('.topbar');
  const exists = !!root;

  // Sanity: sidebar should have rendered filter items (init ran).
  const sideItems = doc.querySelectorAll('.side-item').length;

  console.log('  jsdomError count: ' + err);
  console.log('  root element present: ' + exists);
  console.log('  sidebar items rendered: ' + sideItems);

  if (err === 0 && exists) {
    console.log('\nSMOKE PASS');
    process.exit(0);
  } else {
    console.log('\nSMOKE FAIL');
    process.exit(1);
  }
}, 300);
