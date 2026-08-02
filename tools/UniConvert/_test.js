// UniConvert 纯函数单测
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

const { convert, fmt } = __EXPORTS__;

let pass=0, fail=0;
function eq(name, got, exp){
  const ok = Math.abs(got-exp) < Math.max(1e-6, Math.abs(exp)*1e-6);
  if(ok){ pass++; console.log('  ok: '+name); }
  else { fail++; console.log('  FAIL: '+name+' got='+got+' exp='+exp); }
}
function ok(name, cond){ if(cond){pass++;console.log('  ok: '+name);} else {fail++;console.log('  FAIL: '+name);} }

// 长度
eq('1 km -> 1000 m', convert('length','km','m',1), 1000);
eq('100 cm -> 1 m', convert('length','cm','m',100), 1);
eq('1 mi -> 1609.344 m', convert('length','mi','m',1), 1609.344);
eq('1 m -> 100 cm', convert('length','m','cm',1), 100);
// 质量
eq('1 kg -> 2.20462 lb', convert('mass','kg','lb',1), 2.2046226218);
eq('1000 g -> 1 kg', convert('mass','g','kg',1000), 1);
// 温度（特殊）
eq('0 C -> 32 F', convert('temp','C','F',0), 32);
eq('100 C -> 212 F', convert('temp','C','F',100), 212);
eq('0 C -> 273.15 K', convert('temp','C','K',0), 273.15);
eq('32 F -> 0 C', convert('temp','F','C',32), 0);
eq('300 K -> 26.85 C', convert('temp','K','C',300), 26.85);
// 数据
eq('1024 MB -> 1 GB', convert('data','MB','GB',1024), 1);
eq('1 GB -> 1024 MB', convert('data','GB','MB',1), 1024);
eq('8 bit -> 1 B', convert('data','bit','B',8), 1);
// 体积
eq('1 l -> 1000 ml', convert('volume','l','ml',1), 1000);
eq('1 gal -> 3.785411784 l', convert('volume','gal','l',1), 3.785411784);
// 面积
eq('1 ha -> 10000 m2', convert('area','ha','m2',1), 10000);
// 角度
eq('180 deg -> 3.14159 rad', convert('angle','deg','rad',180), 3.1415926535);
// 速度
eq('100 kmh -> 62.1371 mph', convert('speed','kmh','mph',100), 62.137119223);
// 能量
eq('1 kWh -> 3600000 J', convert('energy','kWh','J',1), 3600000);
// 往返一致
eq('往返 5 km -> mi -> km', convert('length','mi','km', convert('length','km','mi',5)), 5);
// 错误
try{ convert('length','m','m','abc'); ok('无效数值抛错', false); }catch(e){ ok('无效数值抛错', true); }
try{ convert('nope','m','m',1); ok('未知类别抛错', false); }catch(e){ ok('未知类别抛错', true); }

// fmt
ok('fmt 0', fmt(0)==='0');
ok('fmt 1.5', fmt(1.5)==='1.5');
ok('fmt 1000 带逗号', fmt(1000)==='1,000');
ok('fmt 大数指数', fmt(1.2e20).indexOf('e')>=0);

console.log('\n== 结果：'+pass+' 断言，'+fail+' 失败 ==');
process.exit(fail?1:0);
