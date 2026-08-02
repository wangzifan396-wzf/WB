// SnapCompress 纯函数单测
const fs=require('fs');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
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

let pass=0, fail=0;
function ok(n,c){ if(c){pass++;console.log('  ok: '+n);} else {fail++;console.log('  FAIL: '+n);} }
function eq(n,a,b){ ok(n, a===b); }

eq('formatBytes 0', M.formatBytes(0), '0 B');
eq('formatBytes 512', M.formatBytes(512), '512 B');
eq('formatBytes 1KB', M.formatBytes(1024), '1.00 KB');
eq('formatBytes 1.5MB', M.formatBytes(1572864), '1.50 MB');
eq('formatBytes 大', M.formatBytes(5*1024*1024*1024), '5.00 GB');

eq('ext jpg', M.extToMime('a.JPG'), 'image/jpeg');
eq('ext png', M.extToMime('a.png'), 'image/png');
eq('ext webp', M.extToMime('a.webp'), 'image/webp');
eq('ext bmp', M.extToMime('a.bmp'), 'image/bmp');
eq('ext 未知默认 jpeg', M.extToMime('a.xyz'), 'image/jpeg');

eq('scale 不放大', M.computeScale(4000,3000,1920), 1920/4000);
eq('scale 不限制', M.computeScale(800,600,0), 1);
eq('scale 已小返回1', M.computeScale(400,300,1920), 1);

eq('quality jpeg 80', M.qualityFor('image/jpeg',80), 0.8);
eq('quality 边界最小', M.qualityFor('image/jpeg',0), 0.01);
eq('quality png 忽略', M.qualityFor('image/png',80), undefined);

eq('savings 减半', M.savings(1000,500), 50);
eq('savings 增大为负', M.savings(500,1000), -100);
eq('savings 零原', M.savings(0,100), 0);

console.log('\n== 结果：'+pass+' 断言，'+fail+' 失败 ==');
process.exit(fail?1:0);
