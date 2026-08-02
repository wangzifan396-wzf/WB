/* SQLForge jsdom smoke test — run with `node smoke.js`
 * Loads the built single-file index.html, lets the app boot (incl. the
 * inlined SQLite/WASM engine), and verifies the DOM renders without fatal errors.
 */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => errors.push(e && e.message ? e.message : String(e)));

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  virtualConsole: vc,
  pretendToBeVisual: true,
  url: 'https://localhost/'
});
const { window } = dom;

let done = false;
function finish(){
  if (done) return; done = true;
  const d = window.document;
  let okAll = true;
  const ids = ['sql','runBtn','schemaTree','results','historyList','statusDot','statusText','exportCsvBtn','exportJsonBtn'];
  ids.forEach(id => {
    const el = d.getElementById(id);
    if (!el){ okAll = false; console.error('  ✗ missing #' + id); }
    else console.log('  ✓ #' + id);
  });
  const i18nCount = d.querySelectorAll('[data-i18n]').length;
  console.log('  ✓ data-i18n nodes: ' + i18nCount);

  // engine either booted (schema populated) or gracefully failed — both are non-fatal
  const status = d.getElementById('statusText');
  console.log('  ✓ status: ' + (status ? status.textContent : '(none)'));

  const fatal = errors.filter(e => !/initSqlJs|WebAssembly|engine|Could not load/i.test(e));
  if (fatal.length){ okAll = false; console.error('  ✗ fatal jsdom errors: ' + fatal.join(' | ')); }
  else console.log('  ✓ no fatal jsdom errors');

  console.log(okAll ? '\nSMOKE OK' : '\nSMOKE FAIL');
  process.exit(okAll ? 0 : 1);
}

// give the async engine init time to resolve/reject
setTimeout(finish, 2500);
// safety net
setTimeout(() => { if (!done){ console.error('  ✗ smoke timeout'); process.exit(1); } }, 8000);
