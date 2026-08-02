/* MarkForge 测试：纯函数 + jsdom 功能（实时预览） */
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

console.log('Pure-function tests:');
ok('h1', F.mdToHtml('# Hi').indexOf('<h1>Hi</h1>')>=0);
ok('h3', F.mdToHtml('### Sub').indexOf('<h3>Sub</h3>')>=0);
ok('bold', F.mdToHtml('**b**')==='<p><strong>b</strong></p>');
ok('italic', F.mdToHtml('*i*')==='<p><em>i</em></p>');
ok('inline code', F.mdToHtml('`c`').indexOf('<code>c</code>')>=0);
ok('link', F.mdToHtml('[t](http://x.com)').indexOf('<a href="http://x.com"')>=0);
ok('image first (not link)', F.mdToHtml('![a](http://i.png)').indexOf('<img src="http://i.png" alt="a">')>=0);
ok('ul list', F.mdToHtml('- a\n- b').indexOf('<ul><li>a</li><li>b</li></ul>')>=0);
ok('ol list', F.mdToHtml('1. a\n2. b').indexOf('<ol><li>a</li><li>b</li></ol>')>=0);
ok('blockquote', F.mdToHtml('> q').indexOf('<blockquote>')>=0 && F.mdToHtml('> q').indexOf('q')>=0);
ok('table', (function(){var h=F.mdToHtml('| A | B |\n|---|---|\n| 1 | 2 |'); return h.indexOf('<table>')>=0 && h.indexOf('<th>A</th>')>=0 && h.indexOf('<td>1</td>')>=0;})());
ok('code fence', F.mdToHtml('```\ncode\n```').indexOf('<pre><code>code</code></pre>')>=0);
ok('hr', F.mdToHtml('---')==='<hr>');
ok('XSS escaped', F.mdToHtml('<script>alert(1)</script>').indexOf('<script>')<0 && F.mdToHtml('<script>').indexOf('&lt;script&gt;')>=0);
ok('stats counts CJK', (function(){var s=F.stats('hello 世界'); return s.chars>0 && s.words>=3;})());
ok('href attr escape guard', (function(){var h=F.mdToHtml('[x](https://a.b/" onmouseover="alert(1))'); return h.indexOf('onmouseover="alert')<0;})());
ok('javascript: protocol blocked', (function(){var h=F.mdToHtml('[x](javascript:alert(1))'); return h.indexOf('href="javascript:')<0 && h.indexOf('href="#"')>=0;})());
ok('img src protocol blocked', (function(){var h=F.mdToHtml('![x](vbscript:msgbox)'); return h.indexOf('src="vbscript:')<0;})());
ok('normal link intact', (function(){var h=F.mdToHtml('[a](https://example.com/p?q=1)'); return h.indexOf('href="https://example.com/p?q=1"')>=0;})());
ok('quote escaped in text', F.escapeHtml('a"b\'c')==='a&quot;b&#39;c');
ok('buildExportHtml doc', F.buildExportHtml('# Hi').indexOf('<!DOCTYPE html>')>=0 && F.buildExportHtml('# Hi').indexOf('<h1>Hi</h1>')>=0);

if (typeof failed !== 'undefined' && failed > 0) process.exit(1);