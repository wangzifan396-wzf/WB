// PassForge tests: pure-function unit + jsdom functional. Run: node _test.js
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

// deterministic rng
function mulberry32(a){return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}

const full=F.charset({lower:true,upper:true,digit:true,symbol:true,exclude:false});
ok('charset full has 4 groups', full.includes('a')&&full.includes('A')&&full.includes('5')&&full.includes('!'));
ok('charset lower only', F.charset({lower:true,upper:false,digit:false,symbol:false,exclude:false})==='abcdefghijklmnopqrstuvwxyz');
ok('charset exclude removes ambig', !F.charset({lower:true,upper:false,digit:false,symbol:false,exclude:true}).includes('l'));

const rng=mulberry32(42);
const p=F.genPassword(16,{lower:true,upper:true,digit:true,symbol:true,exclude:false},rng);
ok('genPassword length', p.length===16);
const pool=F.charset({lower:true,upper:true,digit:true,symbol:true,exclude:false});
ok('genPassword uses charset only', [...p].every(ch=>pool.includes(ch)));
ok('genPassword deterministic', F.genPassword(16,{lower:true,upper:true,digit:true,symbol:true,exclude:false},mulberry32(42))===p);
ok('genPassword empty charset -> empty', F.genPassword(8,{lower:false,upper:false,digit:false,symbol:false,exclude:false})==='');

const bits=F.entropyBits('a'.repeat(16),{lower:true,upper:true,digit:true,symbol:true,exclude:false});
ok('entropyBits ~16*log2(pool)', Math.abs(bits-16*Math.log2(pool.length))<1e-6);
ok('entropyBits 0 for empty', F.entropyBits('',{lower:true})===0);

ok('rate weak', F.rate(30).label==='弱' && F.rate(30).score===0);
ok('rate mid', F.rate(50).label==='中');
ok('rate strong', F.rate(70).label==='强');
ok('rate very strong', F.rate(100).label==='很强');
ok('rate extreme', F.rate(140).label==='极强');

ok('flaws pure digit', F.flaws('123456').includes('纯数字'));
ok('flaws short', F.flaws('abc').includes('长度不足 8'));
ok('flaws repeat', F.flaws('aaaabbbb').some(x=>x.includes('三连重复')));
ok('flaws password word', F.flaws('password1').length>0);
ok('flaws clean', F.flaws('K7$mV9!qZ2xP').length===0);

const ph=F.genPassphrase(4,'-',F.WORDS,mulberry32(7));
ok('passphrase count', ph.split('-').length===4);
ok('passphrase from list', ph.split('-').every(w=>F.WORDS.includes(w)));

console.log(`pure: ${pass} passed, ${fail} failed`);

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);