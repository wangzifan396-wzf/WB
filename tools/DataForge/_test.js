/* DataForge 测试：纯函数 + jsdom 功能（格式互转 round-trip） */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let passed = 0, failed = 0;
function ok(name, cond){ if(cond){ passed++; console.log('  ✓ '+name); } else { failed++; console.log('  ✗ '+name); } }

const html = fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
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

function norm(s){ return JSON.stringify(JSON.parse(s)); }

console.log('Pure-function tests:');
// CSV
const csv = 'name,version,stable\ncore,1,true\nedge,2,false';
const rows = F.parseCSV(csv);
ok('parseCSV rows', rows.length===2 && rows[0].name==='core' && rows[0].version==='1');
ok('stringifyCSV round-trip', F.stringifyCSV(rows)===csv);
// quoted CSV
const qcsv = 'a,b\n"x,y","has ""q"""';
const qrows = F.parseCSV(qcsv);
ok('parseCSV quoted comma', qrows[0].a==='x,y');
ok('parseCSV quoted escape', qrows[0].b==='has "q"');

// TOML round-trip
const toml = 'name = "demo"\nversion = 2\nstable = true\n\n[owner]\nuser = "wzf"\nage = 30\n\n[[items]]\nid = 1\n[[items]]\nid = 2';
const tobj = F.parseTOML(toml);
ok('parseTOML scalars', tobj.name==='demo' && tobj.version===2 && tobj.stable===true);
ok('parseTOML nested table', tobj.owner && tobj.owner.user==='wzf' && tobj.owner.age===30);
ok('parseTOML array of tables', Array.isArray(tobj.items) && tobj.items.length===2 && tobj.items[1].id===2);
const toml2 = F.stringifyTOML(tobj);
ok('TOML round-trip', JSON.stringify(F.parseTOML(F.stringifyTOML(tobj))) === JSON.stringify(tobj));

// JSON <-> CSV
const arr = [{name:'a',n:1},{name:'b',n:2}];
ok('JSON->CSV->JSON shape', (function(){ var r=F.parseFmt('csv', F.stringifyCSV(arr)); return Array.isArray(r)&&r.length===2&&r[0].name==='a'&&r[0].n==='1'; })());
// JSON <-> TOML
const jobj = {name:'demo',version:2,stable:true,owner:{user:'wzf',age:30},items:[{id:1},{id:2}]};
ok('JSON->TOML->JSON', norm(F.stringifyFmt('json', F.parseFmt('toml', F.stringifyTOML(jobj))))===norm(JSON.stringify(jobj)));
// convert() error path
ok('convert csv target from object errors', F.convert('json','csv','{"a":1}').ok===false);
ok('convert json->csv array ok', F.convert('json','csv','[{"a":1}]').ok===true);

if (typeof failed !== 'undefined' && failed > 0) process.exit(1);