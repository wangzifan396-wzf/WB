// DiffLens 纯函数单测：node _test.js
const fs=require('fs'), path=require('path'), vm=require('vm');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
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

const A = __EXPORTS__;

let pass=0, fail=0;
function eq(a,b,msg){ const x=JSON.stringify(a), y=JSON.stringify(b);
  if(x===y){pass++;} else {fail++; console.log('  FAIL '+msg+'\n    got '+x+'\n    exp '+y);} }
function ok(c,msg){ if(c){pass++;} else {fail++; console.log('  FAIL '+msg);} }
function throws(fn,msg){ try{ fn(); fail++; console.log('  FAIL(应抛错) '+msg);}catch(e){ pass++; } }
function typesOf(ops){ return ops.map(o=>o.type); }

// splitLines
eq(A.splitLines('a\nb\nc').length,3,'splitLines 3行');
eq(A.splitLines('a\r\nb').length,2,'CRLF 分行');
eq(A.splitLines(''),[''],'空串1行');

// diffLines 完全相同
let ops=A.diffLines('a\nb\nc','a\nb\nc',{});
eq(typesOf(ops),['equal','equal','equal'],'相同全 equal');
let s=A.stats(ops);
eq([s.added,s.removed,s.unchanged],[0,0,3],'相同统计');

// 一行修改 = del + add
ops=A.diffLines('a\nb\nc','a\nX\nc',{});
s=A.stats(ops);
eq([s.added,s.removed],[1,1],'改一行 +1 -1');

// 新增一行
ops=A.diffLines('a\nb','a\nb\nc',{});
s=A.stats(ops);
eq([s.added,s.removed,s.unchanged],[1,0,2],'尾部新增');
ok(ops[ops.length-1].type==='add' && ops[ops.length-1].b==='c','最后是 add c');

// 删除一行
ops=A.diffLines('a\nb\nc','a\nc',{});
s=A.stats(ops);
eq([s.added,s.removed,s.unchanged],[0,1,2],'删除中间行');

// 顺序保持：del 的 ai / add 的 bi 正确
ops=A.diffLines('x\ny','y\nz',{});
// LCS 是 'y'：del x, equal y, add z
eq(typesOf(ops),['del','equal','add'],'del-equal-add 序列');

// ignoreCase
ops=A.diffLines('Hello','hello',{ignoreCase:true});
eq(A.stats(ops).unchanged,1,'忽略大小写视为相同');
ops=A.diffLines('Hello','hello',{});
eq(A.stats(ops).unchanged,0,'不忽略大小写视为不同');

// trimWs
ops=A.diffLines('  a  ','a',{trimWs:true});
eq(A.stats(ops).unchanged,1,'忽略空白视为相同');
ops=A.diffLines('  a  ','a',{});
eq(A.stats(ops).unchanged,0,'不忽略空白视为不同');

// sortValue
eq(A.sortValue({b:1,a:2}),{a:2,b:1},'对象键排序');
eq(A.sortValue({z:{y:1,x:2}}),{z:{x:2,y:1}},'嵌套排序');
eq(A.sortValue([{b:1,a:2}]),[{a:2,b:1}],'数组内对象排序');
eq(A.sortValue(5),5,'标量原样');

// normalizeJson
eq(A.normalizeJson('{"a":1}',false),'{\n  "a": 1\n}','美化输出');
let nj=A.normalizeJson('{"b":1,"a":2}',true);
ok(nj.indexOf('"a"')<nj.indexOf('"b"'),'排序后 a 在 b 前');
throws(()=>A.normalizeJson('{bad}',false),'非法JSON抛错');

// JSON 差异：仅值不同
let a1=A.normalizeJson('{"v":"1.0.0","p":3000}',true);
let b1=A.normalizeJson('{"v":"1.2.0","p":3000}',true);
ops=A.diffLines(a1,b1,{});
ok(A.stats(ops).added>=1 && A.stats(ops).removed>=1,'JSON值改动产生增删');

// JSON 键顺序不同但排序后应相同
let a2=A.normalizeJson('{"a":1,"b":2}',true);
let b2=A.normalizeJson('{"b":2,"a":1}',true);
eq(a2,b2,'键序不同排序后规范化一致');

// 大量行不崩（性能/正确）
let big1=Array.from({length:200},(_,i)=>'line'+i).join('\n');
let big2=Array.from({length:200},(_,i)=>i===100?'CHANGED':'line'+i).join('\n');
ops=A.diffLines(big1,big2,{});
eq(A.stats(ops).added,1,'200行仅1处新增');
eq(A.stats(ops).removed,1,'200行仅1处删除');

console.log('\nDiffLens: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
