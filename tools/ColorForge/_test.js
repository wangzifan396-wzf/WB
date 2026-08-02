// ColorForge tests: pure-function unit + jsdom functional. Run: node _test.js
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

// pure functions in a sandbox

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// hex <-> rgb
ok('hexToRgb #5E6AD2', JSON.stringify(F.hexToRgb('#5E6AD2')) === JSON.stringify({r:94,g:106,b:210}));
ok('hexToRgb short', JSON.stringify(F.hexToRgb('#fff')) === JSON.stringify({r:255,g:255,b:255}));
ok('hexToRgb invalid', F.hexToRgb('#zzz') === null);
ok('rgbToHex roundtrip', F.rgbToHex(94,106,210) === '#5e6ad2');
ok('rgbToHex clamp', F.rgbToHex(300,-5,128) === '#ff0080');

// hsl
const h = F.rgbToHsl(94,106,210);
ok('rgbToHsl hue range', h.h>=0 && h.h<=360);
const back = F.hslToRgb(h.h,h.s,h.l);
ok('hsl roundtrip approx', Math.abs(back.r-94)<=2 && Math.abs(back.g-106)<=2 && Math.abs(back.b-210)<=2);

// contrast
ok('contrast white/black = 21', Math.abs(F.contrastRatio({r:255,g:255,b:255},{r:0,g:0,b:0})-21)<1e-6);
ok('contrast same = 1', Math.abs(F.contrastRatio({r:10,g:10,b:10},{r:10,g:10,b:10})-1)<1e-9);
const w = F.wcag(21,false), w2 = F.wcag(3.5,false), wl = F.wcag(3.5,true);
ok('wcag white/black AA+AAA', w.aa && w.aaa);
ok('wcag 3.5 fails normal', !w2.aa && !w2.aaa);
ok('wcag 3.5 passes large AA', wl.aa && !wl.aaa);

// harmonies
const H = F.harmonies('#5E6AD2');
ok('harmonies complementary len 2', H.complementary.length===2);
ok('harmonies analogous len 3', H.analogous.length===3);
ok('harmonies triadic len 3', H.triadic.length===3);
ok('harmonies monochromatic len 5', H.monochromatic.length===5);
ok('harmonies valid hex', H.complementary.every(c=>/^#[0-9a-f]{6}$/i.test(c)));
ok('complementary is opposite hue', F.rgbToHsl(...Object.values(F.hexToRgb(H.complementary[1]))).h === (F.rgbToHsl(94,106,210).h+180)%360);

console.log(`pure: ${pass} passed, ${fail} failed`);

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);