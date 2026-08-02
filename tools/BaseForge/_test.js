// BaseForge tests: pure-function unit + jsdom functional. Run: node _test.js
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

// integer conversions
ok('255 dec->hex', F.convert('255',10,16)==='ff');
ok('ff hex->dec', F.convert('ff',16,10)==='255');
ok('10 dec->bin', F.convert('10',10,2)==='1010');
ok('1010 bin->dec', F.convert('1010',2,10)==='10');
ok('0 zero', F.convert('0',10,16)==='0');
ok('dec->oct', F.convert('64',10,8)==='100');

// negative
ok('neg dec->hex', F.convert('-255',10,16)==='-ff');

// big integers (BigInt precision beyond Number)
ok('bigint identity', F.convert('123456789012345678901234567890',10,10)==='123456789012345678901234567890');
ok('bigint dec->hex', F.convert('18446744073709551615',10,16)==='ffffffffffffffff');
ok('bigint hex->dec', F.convert('ffffffffffffffff',16,10)==='18446744073709551615');

// fractional
ok('255.5 dec->hex', F.convert('255.5',10,16)==='ff.8');
ok('0.5 dec->bin', F.convert('0.5',10,2)==='0.1');
ok('0.25 dec->bin', F.convert('0.25',10,2)==='0.01');
{
  const r = F.convert('ff.8',16,10);
  ok('ff.8 hex->dec ~255.5', r==='255.5');
}

// custom alphabet (base length = alphabet length)
ok('custom hex upper', F.formatNum(F.parseNum('255',10),16,'0123456789ABCDEF')==='FF');
{
  // base62
  const B62='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const enc = F.formatNum(F.parseNum('123456789',10), 62, B62);
  const back = F.formatNum(F.parseNum(enc, 62, B62), 10);
  ok('base62 roundtrip', back==='123456789');
}

// parseNum structure
{
  const n = F.parseNum('ff',16);
  ok('parseNum int type BigInt', typeof n.int==='bigint' && n.int===255n);
}
// invalid char
{
  let threw=false;
  try{ F.parseNum('xyz',10); }catch(e){ threw=true; }
  ok('parseNum invalid char throws', threw);
}

console.log(`pure: ${pass} passed, ${fail} failed`);

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);