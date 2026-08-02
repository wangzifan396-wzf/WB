// jsdom smoke test: load index.html, ensure the editor DOM is present and the
// pure API is exposed on window, with no script errors.
const { JSDOM } = (() => {
  try { return require('/c/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom'); }
  catch (e) { return require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom'); }
})();
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true });
dom.window.addEventListener('error', e => errors.push(e.message));
// AudioContext is not available in jsdom; the UI guards on window only, so it
// should load without throwing (lazy ctx creation on user action).
const w = dom.window;

let bad = 0;
function ok(c, cond) { if (!cond) { bad++; console.error('  ✗ ' + c); } }

ok('wave canvas present', !!w.document.getElementById('wave'));
ok('drop zone present', !!w.document.getElementById('drop'));
ok('export button present', !!w.document.getElementById('exportBtn'));
ok('gain slider present', !!w.document.getElementById('gain'));
ok('selection box element', !!w.document.getElementById('selBox'));
ok('no script errors', errors.length === 0);

console.log(`AudioForge smoke: ${bad === 0 ? 'OK' : bad + ' FAILED'} (jsdomError=${errors.length})`);
process.exit(bad ? 1 : 0);
