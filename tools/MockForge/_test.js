/* MockForge tests —— 纯函数 + jsdom 功能 */
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('  \u2713 '+name);} else {fail++;console.log('  \u2717 '+name);} }

/* ---------- 纯函数 ---------- */
console.log('Pure-function tests:');
const m = require('module');
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

const vm = __EXPORTS__;
const F = __EXPORTS__;

// 确定性：同种子同结果
const s1 = F.genRows([{name:'a',type:'int'},{name:'b',type:'fullName'}], 5, 42);
const s2 = F.genRows([{name:'a',type:'int'},{name:'b',type:'fullName'}], 5, 42);
ok('same seed -> identical rows', JSON.stringify(s1)===JSON.stringify(s2));
const s3 = F.genRows([{name:'a',type:'int'}], 5, 43);
ok('diff seed -> different rows', JSON.stringify(F.genRows([{name:'a',type:'int'}],5,42))!==JSON.stringify(s3));

ok('genRows respects count', F.genRows([{name:'x',type:'word'}], 7, 1).length===7);
ok('count clamped to <=5000', F.genRows([{name:'x',type:'word'}], 99999, 1).length===5000);
ok('count 0 -> empty', F.genRows([{name:'x',type:'word'}], 0, 1).length===0);

// 类型
const rng = F.makeRng(7);
ok('rng in [0,1)', (()=>{const v=F.makeRng(7)(); return v>=0 && v<1;})());
ok('id is i+1', F.genValue('id', rng, 4)===5);
ok('uuid v4 shape', /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(F.genUuid(F.makeRng(1))));
ok('email contains @', String(F.genValue('email', F.makeRng(2), 0)).indexOf('@')>0);
ok('bool is boolean', typeof F.genValue('bool', F.makeRng(3), 0)==='boolean');
ok('date shape YYYY-MM-DD', /^\d{4}-\d{2}-\d{2}$/.test(F.genValue('date', F.makeRng(4), 0)));
ok('int is finite number', Number.isFinite(F.genValue('int', F.makeRng(5), 0)));
ok('phone 11 digits', /^1\d{10}$/.test(String(F.genValue('phone', F.makeRng(6), 0))));

// 导出格式
const rows = F.genRows([{name:'id',type:'id'},{name:'name',type:'fullName'},{name:'ok',type:'bool'}], 3, 42);
const json = F.toJSON(rows);
ok('toJSON parses back', JSON.parse(json).length===3);
const csv = F.toCSV(rows);
ok('toCSV header line has cols', csv.split('\n')[0]==='id,name,ok');
ok('toCSV has 4 lines (header+3)', csv.split('\n').length===4);
const sql = F.toSQL(rows, 'users');
ok('toSQL uses table name', sql.indexOf('INSERT INTO users')===0);
ok('toSQL bool -> TRUE/FALSE', /TRUE|FALSE/.test(sql));
ok('toSQL escapes quotes', F.toSQL([{n:"O'Brien"}],'t').indexOf("O''Brien")>0);
ok('toSQL sanitizes table name', F.toSQL([{a:1}], 'bad name;drop').indexOf('INSERT INTO badnamedrop')===0);

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);