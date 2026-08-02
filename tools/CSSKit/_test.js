/* CSSKit tests —— 纯函数 + jsdom 功能 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('  \u2713 '+name);} else {fail++;console.log('  \u2717 '+name);} }
function approx(a,b){ return Math.abs(a-b) < 1e-9; }

/* ---------- 纯函数 ---------- */
console.log('Pure-function tests:');
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

ok('linear gradient css', F.gradientCss('linear',90,[{color:'#fff',pos:0},{color:'#000',pos:100}])==='linear-gradient(90deg, #fff 0%, #000 100%)');
ok('radial gradient css', F.gradientCss('radial',0,[{color:'#a',pos:0},{color:'#b',pos:100}])==='radial-gradient(circle, #a 0%, #b 100%)');
ok('gradient 3 stops', F.gradientCss('linear',45,[{color:'#1',pos:0},{color:'#2',pos:50},{color:'#3',pos:100}]).split(',').length===4);

ok('single shadow css', F.shadowCss([{x:0,y:10,blur:24,spread:0,color:'rgba(0,0,0,0.4)',inset:false}])==='0px 10px 24px 0px rgba(0,0,0,0.4)');
ok('inset shadow', F.shadowCss([{x:0,y:0,blur:5,spread:0,color:'#000',inset:true}]).indexOf('inset ')===0);
ok('multi-layer shadow joined by comma', F.shadowCss([{x:0,y:1,blur:2,spread:0,color:'#111',inset:false},{x:0,y:8,blur:24,spread:0,color:'#222',inset:false}]).split(', ').length===2);

ok('bezier css', F.bezierCss(0.22,0.61,0.36,1)==='cubic-bezier(0.22, 0.61, 0.36, 1)');
ok('bezier at t=0 -> (0,0)', (()=>{const p=F.bezierXY(0,0.2,0.6,0.4,1); return approx(p.x,0)&&approx(p.y,0);})());
ok('bezier at t=1 -> (1,1)', (()=>{const p=F.bezierXY(1,0.2,0.6,0.4,1); return approx(p.x,1)&&approx(p.y,1);})());
ok('bezier linear midpoint', (()=>{const p=F.bezierXY(0.5,1/3,1/3,2/3,2/3); return approx(p.x,0.5)&&approx(p.y,0.5);})());

const st = F.flexStyle('column','center','stretch','wrap',12);
ok('flexStyle display flex', st.display==='flex');
ok('flexStyle direction', st['flex-direction']==='column');
ok('flexStyle gap px', st.gap==='12px');
ok('cssText renders declarations', F.cssText({display:'flex',gap:'8px'})==='display: flex;\ngap: 8px;');

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);