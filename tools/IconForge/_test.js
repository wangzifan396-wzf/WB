// IconForge tests: pure-function unit + jsdom functional. Run: node _test.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
/* 统一健壮 harness（自动修复）：抽取含 module.exports 的脚本，vm + 浏览器 stub 运行 */
const __VM__ = require('vm');
const __PATH__ = require('path');
const __mk = () => new Proxy(function(){}, { get: (t,p) => {
  if (p === Symbol.toPrimitive) return (hint) => (hint === 'string' ? '' : 0);
  if (p === 'valueOf') return () => 0;
  if (p === 'toString') return () => '';
  if (typeof p === 'symbol') return undefined;
  return __mk();
}, apply: () => __mk(), set: () => true });
const __scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const __stub = {
  console, Math, JSON, Object, Array, String, Number, Boolean, Date, RegExp, Error,
  TextEncoder, TextDecoder,
  atob: s => Buffer.from(s, 'base64').toString('binary'),
  btoa: s => Buffer.from(s, 'binary').toString('base64'),
  navigator: { userAgent: 'node', serviceWorker: { register() { return Promise.resolve(); } } },
  window: __mk(),
  document: __mk(),
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  location: { href: '' },
  crypto: (() => { try { return require('crypto').webcrypto; } catch (e) { return {}; } })(),
  setTimeout, clearTimeout,
  fetch: () => Promise.reject(new Error('offline'))
};
let EXPORTS = {};
for (const __code of __scripts) {
  const __mod = { exports: {} };
  const __ctx = Object.assign({ module: __mod, exports: __mod.exports, require: (p) => require(__PATH__.resolve(__dirname, p)) }, __stub);
  try { __VM__.runInNewContext(__code, __ctx, { filename: 'tool-script.js' }); } catch (e) {}
  if (__mod.exports && typeof __mod.exports === 'object' && Object.keys(__mod.exports).length) EXPORTS = __mod.exports;
}
const __EXPORTS__ = EXPORTS;

const F = __EXPORTS__;

let pass = 0, fail = 0;
function ok(n, c){ if(c) pass++; else { fail++; console.error('FAIL:', n); } }

ok('ICONS is object', typeof F.ICONS==='object' && Object.keys(F.ICONS).length>=10);
ok('each icon has path', Object.values(F.ICONS).every(d=>typeof d==='string' && d.length>5));

const s1=F.buildSvg('home',{size:64,strokeWidth:2,stroke:'#5E6AD2'});
ok('buildSvg returns svg', s1.startsWith('<svg') && s1.endsWith('</svg>'));
ok('buildSvg has viewBox', s1.includes('viewBox="0 0 24 24"'));
ok('buildSvg size', s1.includes('width="64"') && s1.includes('height="64"'));
ok('buildSvg stroke attr', s1.includes('stroke="#5E6AD2"') && s1.includes('stroke-width="2"'));
ok('buildSvg embeds path', s1.includes('<path d="'));
ok('buildSvg no fill default', s1.includes('fill="none"'));

const s2=F.buildSvg('home',{size:32,strokeWidth:1.5,stroke:'#fff',filled:true,fill:'#000'});
ok('buildSvg filled stroke none', s2.includes('stroke="none"'));
ok('buildSvg filled fill set', s2.includes('fill="#000"'));

ok('buildSvg unknown -> empty', F.buildSvg('nope',{})==='');

console.log(`pure: ${pass} passed, ${fail} failed`);

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);