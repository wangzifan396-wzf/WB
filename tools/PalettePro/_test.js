// PalettePro 纯函数单测
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
function near(n,a,b){ ok(n, Math.abs(a-b)<0.01); }

// hexToRgb
eq('hex #fff', JSON.stringify(M.hexToRgb('#fff')), JSON.stringify({r:255,g:255,b:255}));
eq('hex #abc', JSON.stringify(M.hexToRgb('#abc')), JSON.stringify({r:170,g:187,b:204}));
eq('hex #5E6AD2', JSON.stringify(M.hexToRgb('#5E6AD2')), JSON.stringify({r:94,g:106,b:210}));
eq('hex 无效', M.hexToRgb('#zzz'), null);
// rgbToHex 往返
eq('rgb->hex', M.rgbToHex({r:94,g:106,b:210}), '#5e6ad2');
// 对比度
near('白黑对比度 21', M.contrastRatio('#ffffff','#000000'), 21);
near('同色对比度 1', M.contrastRatio('#123456','#123456'), 1);
ok('对比度 无效返回 null', M.contrastRatio('#zzz','#000')===null);
// 真实案例：白底黑字应通过 AAA
ok('白底黑字 AAA', M.contrastRatio('#000000','#ffffff')>=7);

// HSL 往返
var hsl=M.rgbToHsl(M.hexToRgb('#ff0000'));
near('红 hue=0', hsl.h, 0);
near('红 sat=100', hsl.s, 100);
near('红 lum=50', hsl.l, 50);
eq('hsl->rgb 红', M.rgbToHex(M.hslToRgb(hsl.h,hsl.s,hsl.l)), '#ff0000');

// 和谐色
var H=M.harmonies('#ff0000');
eq('互补=青', H.complementary[0], '#00ffff');
eq('三角色含绿', H.triadic[0], '#00ff00');
eq('三角色含蓝', H.triadic[1], '#0000ff');
eq('类似色2个', H.analogous.length, 2);
eq('四角色3个', H.tetradic.length, 3);
ok('和谐无效 null', M.harmonies('#zzz')===null);

// shiftHex 不越界
ok('shift 返回合法 hex', /^#[0-9a-f]{6}$/.test(M.shiftHex('#5e6ad2',90)));

console.log('\n== 结果：'+pass+' 断言，'+fail+' 失败 ==');
process.exit(fail?1:0);
