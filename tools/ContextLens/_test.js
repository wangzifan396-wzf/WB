// ContextLens 纯函数单测：node _test.js
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
function tryOk(fn,check,msg){ try{ const v=fn(); if(check(v)){pass++;} else {fail++; console.log('  FAIL '+msg+' got='+JSON.stringify(v).slice(0,60));} }catch(e){ fail++; console.log('  FAIL '+msg+' threw '+e.message);} }

// 导出存在
ok(A && typeof A==='object','module.exports 对象');

// estimateTokens
ok(typeof A.estimateTokens==='function','estimateTokens 导出');
tryOk(()=>A.estimateTokens('hello world'), v=>typeof v==='number'&&v>0, 'estimateTokens 正数');
tryOk(()=>A.estimateTokens(''), v=>typeof v==='number'&&v>=1, 'estimateTokens 空串>=1');

// charWeight
ok(typeof A.charWeight==='function','charWeight 导出');
tryOk(()=>A.charWeight('a',A.PROFILES.code), v=>typeof v==='number'&&v>=0, 'charWeight 非负');

// PROFILES
ok(A.PROFILES && typeof A.PROFILES==='object','PROFILES 对象');
ok(Object.keys(A.PROFILES).length>0,'PROFILES 非空');

// profileForExt
ok(typeof A.profileForExt==='function','profileForExt 导出');
eq(A.profileForExt('py'),'code','profileForExt(py)=code');
eq(A.profileForExt('md'),'prose','profileForExt(md)=prose');
eq(A.profileForExt('xyz'),'default','profileForExt(未知)=default');

// getExt
ok(typeof A.getExt==='function','getExt 导出');
eq(A.getExt('a/b.js'),'js','getExt 去路径');
eq(A.getExt('README'),'','getExt 无扩展名=空串');

// profileAuto
ok(typeof A.profileAuto==='function','profileAuto 导出');
eq(A.profileAuto('SELECT * FROM users','sql'),'code','profileAuto(sql)=code');
eq(A.profileAuto('你好世界的内容','txt'),'cjk','profileAuto(中文)=cjk');

// MODELS
ok(Array.isArray(A.MODELS)&&A.MODELS.length>0,'MODELS 非空数组');
ok(A.MODELS.every(m=>typeof m.in==='number'),'MODELS 均含价格in');

// costFor
ok(typeof A.costFor==='function','costFor 导出');
tryOk(()=>A.costFor(A.MODELS[0],1000), v=>typeof v==='number'&&v>=0, 'costFor 非负');

// parseGitignore / isIgnored
ok(typeof A.parseGitignore==='function','parseGitignore 导出');
let ig=A.parseGitignore('node_modules\n*.log\n# comment\n');
eq(ig,['node_modules','*.log'],'parseGitignore 去注释空行');
ok(typeof A.isIgnored==='function','isIgnored 导出');
ok(A.isIgnored('node_modules/x.js',['node_modules'])===true,'isIgnored node_modules');
ok(A.isIgnored('src/app.js',['node_modules','*.log'])===false,'isIgnored 普通文件=false');
ok(A.isIgnored('a/b.log',['*.log'])===true,'isIgnored *.log');

// isDefaultIgnored
ok(typeof A.isDefaultIgnored==='function','isDefaultIgnored 导出');
ok(A.isDefaultIgnored('.git')===true,'isDefaultIgnored(.git)=true');
ok(A.isDefaultIgnored('src/app.js')===false,'isDefaultIgnored(普通)=false');

// isBinaryExt
ok(typeof A.isBinaryExt==='function','isBinaryExt 导出');
ok(A.isBinaryExt('png')===true,'isBinaryExt(png)=true');
ok(A.isBinaryExt('js')===false,'isBinaryExt(js)=false');

// buildTree / renderTree
ok(typeof A.buildTree==='function','buildTree 导出');
let tree=A.buildTree([{path:'src/a.js',content:'x',included:true},{path:'src/b.ts',content:'y',included:true},{path:'README.md',content:'z',included:false}]);
ok(tree && tree.src && tree.src['a.js']==='x','buildTree 建树(含included过滤)');
ok(typeof A.renderTree==='function','renderTree 导出');
ok(typeof A.renderTree(tree)==='string','renderTree 返回字符串');

// buildPack*
const SAMPLE=[{path:'src/a.js',content:'console.log(1)',tokens:12,included:true},{path:'README.md',content:'# hi',tokens:3,included:true}];
ok(typeof A.buildPackMarkdown==='function','buildPackMarkdown 导出');
let md=A.buildPackMarkdown(SAMPLE);
ok(typeof md==='string'&&md.indexOf('src/a.js')>=0,'buildPackMarkdown 含文件名');
ok(typeof A.buildPackXml==='function','buildPackXml 导出');
let xml=A.buildPackXml(SAMPLE);
ok(typeof xml==='string'&&xml.indexOf('<context>')>=0,'buildPackXml 含<context>');
ok(typeof A.buildPackJson==='function','buildPackJson 导出');
let js=A.buildPackJson(SAMPLE);
ok(typeof js==='string'&&JSON.parse(js).files.length===2,'buildPackJson 可解析且2文件');

console.log('\nContextLens: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
