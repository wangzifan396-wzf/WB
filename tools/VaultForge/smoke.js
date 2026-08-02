const fs = require('fs');
const path = require('path');
const JSDOMModule = require('C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom');
const JSDOM = JSDOMModule.JSDOM;
const VirtualConsole = JSDOMModule.VirtualConsole;

// jsdom smoke test: confirm the page initializes (DOM present, no fatal JS
// errors) WITHOUT exercising Web Crypto. jsdom may not implement crypto.subtle,
// so we only assert the page boots and root elements exist.
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

let errCount = 0;
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => {
  errCount++;
  console.error('  jsdomError: ' + (e && e.message ? e.message : e));
});

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc
});

const { window } = dom;

// Give scripts a tick to run.
setTimeout(() => {
  const doc = window.document;
  const hasApp = !!doc.getElementById('app');
  const hasModal = !!doc.getElementById('unlockModal');
  const hasMain = !!doc.getElementById('main');
  const hasBrand = !!doc.querySelector('.brand-strip');

  console.log('VaultForge smoke.js');
  console.log('  #app           :', hasApp);
  console.log('  #unlockModal   :', hasModal);
  console.log('  #main          :', hasMain);
  console.log('  .brand-strip   :', hasBrand);

  let fail = 0;
  if (errCount !== 0) { console.error('  FAIL jsdomError=' + errCount); fail++; }
  if (!hasApp) { console.error('  FAIL #app missing'); fail++; }
  if (!hasModal) { console.error('  FAIL #unlockModal missing'); fail++; }
  if (!hasMain) { console.error('  FAIL #main missing'); fail++; }
  if (!hasBrand) { console.error('  FAIL .brand-strip missing'); fail++; }

  if (fail === 0) {
    console.log('SMOKE PASS, jsdomError=' + errCount);
    process.exit(0);
  } else {
    console.error('SMOKE FAIL');
    process.exit(1);
  }
}, 300);
