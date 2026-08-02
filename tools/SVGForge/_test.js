/* SVGForge tests —— 纯函数 + jsdom 功能 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
let pass = 0, fail = 0;
function ok(name, cond){ if(cond){pass++;console.log('  \u2713 '+name);} else {fail++;console.log('  \u2717 '+name);} }

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

ok('stripComments removes comments', F.stripComments('<svg><!-- x --><g/></svg>')==='<svg><g/></svg>');
ok('stripMetaTags removes title/desc/metadata', F.stripMetaTags('<svg><title>t</title><desc>d</desc><metadata>m</metadata><g/></svg>')==='<svg><g/></svg>');
ok('roundNumbers to 2', F.roundNumbers('48.123456',2)==='48.12');
ok('roundNumbers to 0', F.roundNumbers('60.00000',0)==='60');
ok('roundNumbers keeps integers', F.roundNumbers('width="120"',2)==='width="120"');
ok('roundNumbers negative', F.roundNumbers('-3.14159',2)==='-3.14');
ok('collapse whitespace between tags', F.collapse('<svg>  \n <g/>  </svg>')==='<svg><g/></svg>');

const raw = '<?xml version="1.0"?>\n<!-- c -->\n<svg xmlns="http://www.w3.org/2000/svg">\n  <title>x</title>\n  <circle cx="10.00000" r="5.98765"/>\n</svg>';
const opt = F.optimizeSvg(raw, {precision:2, stripMeta:true});
ok('optimize drops xml decl', opt.indexOf('<?xml')<0);
ok('optimize drops comment', opt.indexOf('<!--')<0);
ok('optimize drops title', opt.indexOf('<title')<0);
ok('optimize rounds numbers', opt.indexOf('5.99')>0 && opt.indexOf('5.98765')<0);
ok('optimize no double spaces', !/\s{2,}/.test(opt));
ok('optimize smaller than raw', F.byteLen(opt) < F.byteLen(raw));

ok('byteLen ascii', F.byteLen('abc')===3);
ok('byteLen cjk 3 bytes', F.byteLen('中')===3);
ok('savedPct 50%', F.savedPct(100,50)===50);
ok('savedPct 0 when before 0', F.savedPct(0,0)===0);

const uri = F.toDataUri('<svg xmlns="http://www.w3.org/2000/svg"><g/></svg>');
ok('dataUri prefix', uri.indexOf('data:image/svg+xml,')===0);
ok('dataUri keeps single quotes', uri.indexOf("'")>0 && uri.indexOf('%22')<0);
ok('cssBg wraps url', F.toCssBg('<svg/>').indexOf('background-image: url("data:image/svg+xml,')===0);

if (typeof fail !== 'undefined' && fail > 0) process.exit(1);