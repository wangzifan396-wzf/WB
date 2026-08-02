const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
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

const M = __EXPORTS__;

let pass = 0, fail = 0;
function eq(name, got, exp) { if (JSON.stringify(got) === JSON.stringify(exp)) pass++; else { fail++; console.log('FAIL ' + name + ' got=' + JSON.stringify(got) + ' exp=' + JSON.stringify(exp)); } }
function ok(name, cond) { if (cond) pass++; else { fail++; console.log('FAIL ' + name); } }

// existing (regression)
ok('json format', M.jsonCompute('{"a":1}', {mode:'format'}).text.indexOf('\n') >= 0);
ok('base64 roundtrip', M.b64ToBytes(M.bytesToB64(new TextEncoder().encode('héllo'))) === 'héllo');
ok('url dec', M.urlCompute('%E4%B8%AD', {mode:'dec'}).text === '中');
ok('time ts', M.timeCompute('1700000000').text.indexOf('T') >= 0);
ok('base 10->16', M.baseCompute('255', {from:10,to:16}).text.toLowerCase() === 'ff');
ok('color', M.colorCompute('#ff0000').text.indexOf('rgb(255, 0, 0)') >= 0);
ok('case snake', M.caseCompute('myVariableName', {mode:'snake'}).text === 'my_variable_name');
ok('cron', M.cronCompute('*/5 9-17 * * 1-5').text.indexOf('每 5') >= 0);
ok('diff', M.diffCompute('a\nb', {b:'a\nc'}).text.indexOf('del') >= 0);

// NEW: yaml
var y = M.yamlCompute('{"name":"box","tags":["a","b"],"n":3}', {mode:'j2y'}).text;
ok('yaml j2y has key', y.indexOf('name: box') >= 0);
ok('yaml j2y array', y.indexOf('- a') >= 0 && y.indexOf('- b') >= 0);
var back = M.yamlCompute(y, {mode:'y2j'}).text;
eq('yaml roundtrip', JSON.parse(back), {name:'box', tags:['a','b'], n:3});
var nested = M.yamlCompute('a:\n  b:\n    c: 1\n  d: 2', {mode:'y2j'}).text;
eq('yaml nested', JSON.parse(nested), {a:{b:{c:1}, d:2}});
var arrMap = M.yamlCompute('- name: foo\n  age: 3\n- name: bar\n  age: 4', {mode:'y2j'}).text;
eq('yaml arr of maps', JSON.parse(arrMap), [{name:'foo', age:3},{name:'bar', age:4}]);

// NEW: sql
var sql = M.sqlCompute('select a,b from t where x=1 and y=2 order by a').text;
ok('sql uppercase', sql.indexOf('SELECT') >= 0);
ok('sql newline from', sql.indexOf('\nFROM') >= 0);
ok('sql and indent', sql.indexOf('\n  AND') >= 0);

// NEW: slug
eq('slug basic', M.slugifyCompute('Hello World! 2026', {mode:'slug'}).text, 'hello-world-2026');
eq('slug plain', M.slugifyCompute('My Cool Page', {mode:'plain'}).text, 'mycoolpage');
eq('slug drops cjk', M.slugifyCompute('你好 World', {mode:'slug'}).text, 'world');

// NEW: lorem
ok('lorem para', M.loremCompute(null, {count:2, mode:'para'}).text.split('\n\n').length === 2);
ok('lorem word', M.loremCompute(null, {count:4, mode:'word'}).text.split(' ').length === 4);

console.log('UNIT PASS ' + pass + ' FAIL ' + fail);
process.exit(fail ? 1 : 0);
