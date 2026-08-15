/* SwatchForge jsdom 冒烟测试 — 便携 require（优先本地 jsdom，回退已知工作区路径） */
let JSDOM, VirtualConsole;
try {
  ({ JSDOM, VirtualConsole } = require('jsdom'));
} catch (e) {
  ({ JSDOM, VirtualConsole } = require(process.env.JSDOM_PATH || 'C:/Users/53014/.workbuddy/binaries/node/workspace/node_modules/jsdom'));
}
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const IGNORE = /Not implemented|getContext|createObjectURL|revokeObjectURL|HTMLCanvasElement|canvas|matchMedia|scrollIntoView|IntersectionObserver|ResizeObserver|Blob|requestAnimationFrame|download|clipboard|color-mix/i;
const errs = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { const msg = (e && (e.message || String(e))) || ''; if (!IGNORE.test(msg)) errs.push(msg); });
const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
const { window } = dom;
window.addEventListener('error', e => { const msg = (e && e.message) || ''; if (!IGNORE.test(msg)) errs.push(msg); });
setTimeout(() => {
  const doc = window.document; let pass = 0, fail = 0;
  const ok = (n, c) => c ? pass++ : (fail++, console.error('  FAIL: ' + n));
  ok('document body present', !!doc.body);
  ok('has interactive controls', doc.querySelectorAll('button,input,textarea,select,[contenteditable]').length > 0);
  ok('palette rendered 5 swatches', doc.querySelectorAll('.swatch').length === 5);
  ok('harmony rules populated', doc.querySelectorAll('#harmonyRule option').length === 6);
  ok('export tabs populated', doc.querySelectorAll('#formatTabs .tab').length === 5);
  ok('export output non-empty', (doc.querySelector('#exportOutput').textContent || '').length > 0);
  ok('pure Color global exposed', typeof window.Color === 'object');
  ok('no real js errors', errs.length === 0);
  if (errs.length) console.error('  js errors:', errs);
  const tool = path.basename(__dirname);
  console.log(tool + ' smoke: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
}, 500);
