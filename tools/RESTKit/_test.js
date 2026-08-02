/* RESTKit 测试：纯函数 + jsdom 功能（mock fetch） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0, failed = 0;
function ok(name, cond){ if(cond){ passed++; console.log('  ✓ '+name); } else { failed++; console.log('  ✗ '+name); } }

const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');

/* ---------- A. 纯函数单测 ---------- */
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

console.log('Pure-function tests:');
ok('parseHeaders', JSON.stringify(F.parseHeaders('A: b\nC: d'))==='{"A":"b","C":"d"}');
ok('headersToText round-trip', F.headersToText(F.parseHeaders('X: y'))==='X: y');
ok('parseKV', JSON.stringify(F.parseKV('a=1\nb=2'))==='{"a":"1","b":"2"}');
ok('buildQuery encodes', F.buildQuery({a:'1',b:'x y'})==='a=1&b=x%20y');
ok('buildUrl appends ?', F.buildUrl('http://x',{a:'2'})==='http://x?a=2');
ok('buildUrl & when has ?', F.buildUrl('http://x?z=1',{a:'2'})==='http://x?z=1&a=2');
ok('formatBytes 0', F.formatBytes(0)==='0 B');
ok('formatBytes KB', F.formatBytes(1500)==='1.5 KB');
ok('statusClass 200', F.statusClass(200)==='s2');
ok('statusClass 301', F.statusClass(301)==='s3');
ok('statusClass 404', F.statusClass(404)==='s4');
ok('statusClass 500', F.statusClass(500)==='s5');
ok('statusClass 0 err', F.statusClass(0)==='err');
ok('prettyJson ok', F.prettyJson('{"a":1}').ok===true && F.prettyJson('{"a":1}').text.indexOf('\n')>=0);
ok('prettyJson invalid', F.prettyJson('{bad').ok===false);
// history with mock storage
const store = { _d:{}, getItem(k){return this._d[k]||null;}, setItem(k,v){this._d[k]=v;}, removeItem(k){delete this._d[k];} };
F.historyClear(store); F.historyAdd(store,{method:'GET',url:'u',status:200});
ok('history stores', F.historyGet(store).length===1 && F.historyGet(store)[0].method==='GET');
F.historyClear(store);
ok('history clears', F.historyGet(store).length===0);

if (typeof failed !== 'undefined' && failed > 0) process.exit(1);