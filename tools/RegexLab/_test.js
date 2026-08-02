// RegexLab 纯函数单测：node _test.js
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

// buildFlags
eq(A.buildFlags({g:true,i:true}), 'gi', 'buildFlags gi');
eq(A.buildFlags({m:true,s:true,g:true}), 'gms', 'buildFlags order gms');
eq(A.buildFlags({}), '', 'buildFlags empty');

// runRegex 基础
let r=A.runRegex('\\d+','g','a12 b34');
ok(r.ok,'runRegex ok');
eq(r.matches.length,2,'两处数字匹配');
eq(r.matches[0].match,'12','第一处 12');
eq(r.matches[1].match,'34','第二处 34');
eq(r.matches[0].index,1,'第一处位置 1');

// 捕获组
r=A.runRegex('(\\w+)@(\\w+)','g','alice@example bob@mail');
eq(r.matches.length,2,'邮箱前缀两处');
eq(r.matches[0].groups[0].value,'alice','组1=alice');
eq(r.matches[0].groups[1].value,'example','组2=example');

// 命名组
r=A.runRegex('(?<year>\\d{4})-(?<mon>\\d{2})','g','2026-07');
ok(r.matches[0].groups.some(g=>g.name==='year'&&g.value==='2026'),'命名组 year');
ok(r.matches[0].groups.some(g=>g.name==='mon'&&g.value==='07'),'命名组 mon');

// 无 g 只取第一个
r=A.runRegex('\\d','','a1b2c3');
eq(r.matches.length,1,'无g只取第一个');

// i 大小写
r=A.runRegex('abc','gi','ABC abc AbC');
eq(r.matches.length,3,'忽略大小写三处');

// 空匹配不死循环
r=A.runRegex('a*','g','baa');
ok(r.ok && r.matches.length>0,'空匹配安全');

// 语法错误
r=A.runRegex('(','g','x');
ok(!r.ok && r.error,'语法错误被捕获');

// 空 pattern
r=A.runRegex('','g','x');
ok(r.ok && r.matches.length===0,'空pattern无匹配');

// escapeHtml
eq(A.escapeHtml('<a>&"'),'&lt;a&gt;&amp;"','escapeHtml');

// highlightHtml
let matches=A.runRegex('\\d+','g','a12b34').matches;
let h=A.highlightHtml('a12b34', matches);
ok(h.indexOf('<mark>12</mark>')>=0,'高亮12');
ok(h.indexOf('34')>=0,'高亮含34');
eq(A.highlightHtml('abc',[]),'abc','无匹配原样返回');

// highlightHtml 转义
let hm=A.runRegex('<','g','a<b').matches;
ok(A.highlightHtml('a<b',hm).indexOf('&lt;')>=0,'高亮内转义');

// doReplace
eq(A.doReplace('(\\w+)@(\\w+)','g','a@b','$1_$2'),'a_b','替换$1$2');
eq(A.doReplace('\\d','g','a1b2','#'),'a#b#','全局替换');
eq(A.doReplace('\\d','','a1b2','#'),'a#b2','非全局只替换首个');
eq(A.doReplace('(','g','x','y'),null,'替换语法错误返回null');

// LIB / CHEAT 存在且正则均合法
ok(A.LIB.length>=10,'LIB 数量');
A.LIB.forEach(function(x){ try{ new RegExp(x.p,x.f); }catch(e){ fail++; console.log('  FAIL LIB 正则非法: '+x.t+' '+e.message);} });
pass++; // LIB 合法性整体计一分
ok(A.CHEAT.length>=20,'CHEAT 数量');

// 邮箱库正则实测
r=A.runRegex(A.LIB[0].p, A.LIB[0].f, 'x alice@example.com y');
eq(r.matches[0].match,'alice@example.com','邮箱库匹配');

console.log('\nRegexLab: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
