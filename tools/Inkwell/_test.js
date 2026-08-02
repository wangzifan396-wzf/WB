const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
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
// node --check equivalent

let pass = 0, fail = 0;
function eq(name, got, exp) { if (got === exp) pass++; else { fail++; console.log('FAIL ' + name + ' got=' + JSON.stringify(got) + ' exp=' + JSON.stringify(exp)); } }
function ok(name, cond) { if (cond) pass++; else { fail++; console.log('FAIL ' + name); } }

// markdown
ok('h1', M.mdToHtml('# Hi').indexOf('<h1>Hi</h1>') >= 0);
ok('h3', M.mdToHtml('### Sub').indexOf('<h3>Sub</h3>') >= 0);
ok('bold', M.mdToHtml('**x**').indexOf('<strong>x</strong>') >= 0);
ok('italic', M.mdToHtml('a *b* c').indexOf('<em>b</em>') >= 0);
ok('code', M.mdToHtml('`a`').indexOf('<code>a</code>') >= 0);
ok('ul', M.mdToHtml('- a\n- b').indexOf('<ul>') >= 0 && M.mdToHtml('- a').indexOf('<li>a</li>') >= 0);
ok('ol', M.mdToHtml('1. a').indexOf('<ol>') >= 0);
ok('hr', M.mdToHtml('---').indexOf('<hr>') >= 0);
ok('blockquote', M.mdToHtml('> q').indexOf('<blockquote>') >= 0);
ok('extlink', M.mdToHtml('[t](https://e.com)').indexOf('href="https://e.com"') >= 0);
ok('wikilink', M.mdToHtml('[[Note]]').indexOf('class="wl"') >= 0 && M.mdToHtml('[[Note]]').indexOf('data-wl="Note"') >= 0);
ok('xss-escape', M.mdToHtml('<script>alert(1)</script>').indexOf('<script>') === -1);
ok('table', M.mdToHtml('| a | b |\n| --- | --- |\n| 1 | 2 |').indexOf('<table>') >= 0);
ok('code-fence', M.mdToHtml('```\nlet x=1;\n```').indexOf('<pre><code>') >= 0);
ok('inline-code-safe', M.mdToHtml('`<b>`').indexOf('<code>&lt;b&gt;</code>') >= 0);

// wikilinks
eq('wl-parse', JSON.stringify(M.parseWikilinks('see [[A]] and [[B]] [[A]]')), JSON.stringify(['A', 'B']));

// graph
var notes = [
  { id: '1', title: 'A', content: 'link [[B]]' },
  { id: '2', title: 'B', content: 'link [[A]]' },
  { id: '3', title: 'C', content: 'no links here' }
];
var g = M.buildGraph(notes);
eq('graph nodes', g.nodes.length, 3);
eq('graph edges', g.edges.length, 2);
var g2 = M.forceLayout(M.buildGraph(notes), 800, 600, 60);
ok('layout finite', g2.nodes.every(function (n) { return isFinite(n.x) && isFinite(n.y); }));
ok('layout bounds', g2.nodes.every(function (n) { return n.x >= 0 && n.x <= 800 && n.y >= 0 && n.y <= 600; }));

// esc
eq('esc', M.esc('<a>&'), '&lt;a&gt;&amp;');

console.log('UNIT PASS ' + pass + ' FAIL ' + fail);
process.exit(fail ? 1 : 0);
