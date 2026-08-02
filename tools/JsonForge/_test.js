// JsonForge — pure function unit tests
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
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

const L = __EXPORTS__;

let pass=0, fail=0;
function eq(a,b,msg){ const A=JSON.stringify(a),B=JSON.stringify(b); if(A===B){pass++;}else{fail++;console.error("FAIL:",msg,"\n  got:",A,"\n  exp:",B);} }
function ok(c,msg){ if(c){pass++;}else{fail++;console.error("FAIL:",msg);} }

// ---- parse / format / minify ----
eq(L.formatJson('{"a":1,"b":2}',2), '{\n  "a": 1,\n  "b": 2\n}', "format");
eq(L.minifyJson('{\n  "a": 1\n}'), '{"a":1}', "minify");
try{ L.parseJson("{bad}"); fail++; console.error("FAIL: parse bad should throw"); }catch(e){ pass++; }
try{ L.parseJson(""); fail++; console.error("FAIL: parse empty should throw"); }catch(e){ pass++; }

// ---- sort keys (recursive) ----
eq(L.sortValue({b:1,a:2,c:{z:1,y:2}}), {a:2,b:1,c:{y:2,z:1}}, "sortValue recursive");
eq(L.sortValue([{b:1,a:2}]), [{a:2,b:1}], "sortValue in array");
eq(L.sortValue(42), 42, "sortValue primitive");
eq(JSON.parse(L.sortJson('{"b":1,"a":2}')), {a:2,b:1}, "sortJson");

// ---- stats ----
const st = L.statsOf({a:1,b:"x",c:[1,2,{d:true}],e:null});
eq(st.numbers, 3, "stats numbers (a=1 + 1,2)");
eq(st.strings, 1, "stats strings");
eq(st.booleans, 1, "stats booleans");
eq(st.nulls, 1, "stats nulls");
eq(st.arrays, 1, "stats arrays");
eq(st.objects, 2, "stats objects (root + nested)");
ok(st.depth >= 3, "stats depth");
ok(st.keys >= 5, "stats keys count");

// ---- toTsType ----
const ts1 = L.toTsType({name:"x",age:3,ok:true}, "User");
ok(/interface User/.test(ts1), "ts has interface User");
ok(/name: string;/.test(ts1), "ts name string");
ok(/age: number;/.test(ts1), "ts age number");
ok(/ok: boolean;/.test(ts1), "ts ok boolean");

const ts2 = L.toTsType({tags:["a","b"]}, "Root");
ok(/tags: string\[\];/.test(ts2), "ts array of string");

const ts3 = L.toTsType({items:[{id:1}]}, "Root");
ok(/interface/.test(ts3) && /id: number/.test(ts3), "ts nested object array");

const ts4 = L.toTsType({val:null}, "Root");
ok(/val: null;/.test(ts4), "ts null type");

const ts5 = L.toTsType({empty:[]}, "Root");
ok(/empty: any\[\];/.test(ts5), "ts empty array -> any[]");

// primitive root
ok(/type Root = string;/.test(L.toTsType("hello","Root")), "ts primitive root");

// key with special char quoted
const ts6 = L.toTsType({"a-b":1}, "Root");
ok(/"a-b": number;/.test(ts6), "ts special key quoted");

// ---- jsonPath ----
const data = {
  users:[{name:"Alice",id:1},{name:"Bob",id:2}],
  meta:{count:2, nested:{deep:"value"}},
  list:[10,20,30]
};
eq(L.jsonPath(data,"$"), [data], "path root");
eq(L.jsonPath(data,"$.meta.count"), [2], "path nested key");
eq(L.jsonPath(data,"$.users[0].name"), ["Alice"], "path array index + key");
eq(L.jsonPath(data,"$.users[1].id"), [2], "path second element");
eq(L.jsonPath(data,"$.list[-1]"), [30], "path negative index");
eq(L.jsonPath(data,"$.users[*].name"), ["Alice","Bob"], "path wildcard array");
eq(L.jsonPath(data,"$.meta.nested.deep"), ["value"], "path deep");
eq(L.jsonPath(data,"$.notexist"), [], "path missing key -> empty");
eq(L.jsonPath(data,"$.users[9]"), [], "path out-of-range -> empty");
eq(L.jsonPath(data,'$.meta["count"]'), [2], "path bracket string key");
eq(L.jsonPath(data,"$.list[*]"), [10,20,30], "path wildcard all elements");

console.log(`\nJsonForge: ${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
