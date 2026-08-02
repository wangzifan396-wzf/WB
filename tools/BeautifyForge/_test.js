/* BeautifyForge kernel tests */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> block'); process.exit(1); }

const mod = { exports: {} };
new Function('module', 'exports', 'require', m[1])(mod, mod.exports, require);
const BF = mod.exports;

let pass = 0, fail = 0;
function ok(cond, name) {
  if (cond) { pass++; }
  else { fail++; console.error('FAIL: ' + name); }
}
function eq(a, b, name) {
  if (a === b) { pass++; }
  else { fail++; console.error('FAIL: ' + name + '\n  got:      ' + JSON.stringify(a) + '\n  expected: ' + JSON.stringify(b)); }
}

/* ---------- tokenizeJS ---------- */
(function () {
  const t = BF.tokenizeJS('var a = "x // not comment";');
  ok(t.some(x => x.t === 'str' && x.v === '"x // not comment"'), 'tokenizeJS: string with // not treated as comment');

  const t2 = BF.tokenizeJS('a = /re\\/gex/g; b = 1/2;');
  ok(t2.some(x => x.t === 're' && x.v === '/re\\/gex/g'), 'tokenizeJS: regex literal detected');
  ok(!t2.some(x => x.t === 're' && x.v.indexOf('1') >= 0), 'tokenizeJS: division not mistaken for regex');

  const t3 = BF.tokenizeJS('/* block */ // line\nx');
  ok(t3.some(x => x.t === 'com'), 'tokenizeJS: block comment');
  ok(t3.some(x => x.t === 'lcom'), 'tokenizeJS: line comment');

  const t4 = BF.tokenizeJS('`tpl ${a + `${b}`} end`');
  eq(t4.filter(x => x.t === 'str').length, 1, 'tokenizeJS: nested template literal as one token');

  const t5 = BF.tokenizeJS('a===b!==c>>>=d');
  ok(t5.some(x => x.v === '==='), 'tokenizeJS: === op');
  ok(t5.some(x => x.v === '!=='), 'tokenizeJS: !== op');
  ok(t5.some(x => x.v === '>>>='), 'tokenizeJS: >>>= op');

  const t6 = BF.tokenizeJS('0xFF 0b101 1.5e-3 .25');
  eq(t6.filter(x => x.t === 'num').length, 4, 'tokenizeJS: number formats');

  /* roundtrip: joining token values reproduces source */
  const src = 'function f(a){return a?/x/:1/2}';
  eq(BF.tokenizeJS(src).map(x => x.v).join(''), src, 'tokenizeJS: lossless roundtrip');
})();

/* ---------- formatJS ---------- */
(function () {
  const out = BF.formatJS('function f(a){if(a>1){return a*2;}return 0;}');
  ok(out.indexOf('function f(a) {') >= 0, 'formatJS: space before brace');
  ok(out.indexOf('\n  if (a > 1) {') >= 0, 'formatJS: indent + keyword spacing');
  ok(out.indexOf('\n    return a * 2;') >= 0, 'formatJS: nested indent');
  ok(/\n\}$/.test(out), 'formatJS: closing brace at col 0');

  const out2 = BF.formatJS('var s="a;b{c}";// tail\nvar t=1;');
  ok(out2.indexOf('"a;b{c}"') >= 0, 'formatJS: string content untouched');
  ok(out2.indexOf('// tail') >= 0, 'formatJS: line comment preserved');

  const out3 = BF.formatJS('for(var i=0;i<3;i++){x(i)}');
  ok(out3.indexOf('for (var i = 0; i < 3; i++) {') >= 0, 'formatJS: for header stays on one line');

  const out4 = BF.formatJS('var o={};');
  ok(out4.indexOf('{}') >= 0, 'formatJS: empty object stays inline');

  const out5 = BF.formatJS('if(a){b()}else{c()}');
  ok(out5.indexOf('} else {') >= 0, 'formatJS: else joins closing brace');

  const out6 = BF.formatJS('a.b.c();d?.e;');
  ok(out6.indexOf('a.b.c()') >= 0, 'formatJS: member chain no spaces');
  ok(out6.indexOf('d?.e') >= 0, 'formatJS: optional chain no spaces');
})();

/* ---------- minifyJS ---------- */
(function () {
  const out = BF.minifyJS('function  f ( a ) { /* c */ return a + 1 ; } // done');
  eq(out, 'function f(a){return a+1;}', 'minifyJS: strips ws + comments');

  const out2 = BF.minifyJS('var a = 1 + +b; var c = i++ + 1;');
  ok(out2.indexOf('+ +') >= 0 || out2.indexOf('+ +b') >= 0, 'minifyJS: keeps space between + and +');
  ok(out2.indexOf('++ +') >= 0 || out2.indexOf('+++') < 0, 'minifyJS: no +++ ambiguity');

  const out3 = BF.minifyJS('var s = "keep   spaces";');
  ok(out3.indexOf('"keep   spaces"') >= 0, 'minifyJS: string spaces preserved');

  const out4 = BF.minifyJS('return typeof x');
  eq(out4, 'return typeof x', 'minifyJS: keyword/id space kept');

  const out5 = BF.minifyJS('var re = /a b/g;');
  ok(out5.indexOf('/a b/g') >= 0, 'minifyJS: regex spaces preserved');

  /* minified code still evaluates */
  const min = BF.minifyJS('function fib(n){ if (n < 2) return n; return fib(n-1) + fib(n-2); } fib(10)');
  eq(eval(min), 55, 'minifyJS: output still evaluates correctly');
})();

/* ---------- CSS ---------- */
(function () {
  const out = BF.formatCSS('.a{color:red;margin:0 auto}.b:hover{top:1px}');
  ok(out.indexOf('.a {') >= 0, 'formatCSS: selector + brace');
  ok(out.indexOf('\n  color: red;') >= 0, 'formatCSS: prop indent + colon space');
  ok(out.indexOf('.b:hover {') >= 0, 'formatCSS: pseudo-class colon untouched');

  const out2 = BF.formatCSS('@media(max-width:600px){.c{padding:8px}}');
  ok(out2.indexOf('@media(max-width:600px) {') >= 0, 'formatCSS: media query paren colon untouched');
  ok(out2.indexOf('\n  .c {') >= 0, 'formatCSS: nested rule indent');

  const out3 = BF.formatCSS('/* note */.d{background:url("a b.png")}');
  ok(out3.indexOf('/* note */') >= 0, 'formatCSS: comment preserved');
  ok(out3.indexOf('url("a b.png")') >= 0, 'formatCSS: url string preserved');

  const min = BF.minifyCSS('.a {\n  color : red ;\n  margin : 0 auto ;\n}\n/* gone */\n.b { top : 1px }');
  eq(min, '.a{color:red;margin:0 auto}.b{top:1px}', 'minifyCSS: full pipeline');

  const min2 = BF.minifyCSS('.x{background:url("keep  space.png");font:12px/1.5 sans-serif}');
  ok(min2.indexOf('"keep  space.png"') >= 0, 'minifyCSS: string spaces preserved');

  const min3 = BF.minifyCSS('.y{width:calc(100% - 20px)}');
  ok(min3.indexOf('calc(100% - 20px)') >= 0, 'minifyCSS: calc() inner spaces preserved');

  const min4 = BF.minifyCSS('div > p , a ~ b{x:1}');
  eq(min4, 'div>p,a~b{x:1}', 'minifyCSS: combinator spaces removed');
})();

/* ---------- HTML ---------- */
(function () {
  const toks = BF.tokenizeHTML('<div class="a>b"><br><script>var x="</div>";<\/script></div>');
  ok(toks[0].t === 'open' && toks[0].v.indexOf('a>b') >= 0, 'tokenizeHTML: > inside attr quote handled');
  const raw = toks.find(t => t.t === 'raw');
  ok(raw && raw.content.indexOf('</div>') >= 0, 'tokenizeHTML: script content raw (tag inside string kept)');

  const out = BF.formatHTML('<div><p>hi</p><img src="a.png"></div>');
  const lines = out.split('\n');
  eq(lines[0], '<div>', 'formatHTML: open at level 0');
  eq(lines[1], '  <p>', 'formatHTML: child indented');
  eq(lines[lines.length - 1], '</div>', 'formatHTML: close back at level 0');
  ok(out.indexOf('  <img src="a.png">') >= 0, 'formatHTML: void tag no indent increase');

  const out2 = BF.formatHTML('<ul>\n\n  <li> a </li><li>b</li>\n</ul>');
  ok(out2.indexOf('  <li>\n    a\n  </li>') >= 0 || out2.indexOf('    a') >= 0, 'formatHTML: text trimmed and indented');

  const min = BF.minifyHTML('<div>\n  <p> hello </p>\n  <!-- gone -->\n</div>');
  eq(min, '<div><p>hello</p></div>', 'minifyHTML: whitespace + comments stripped');

  const min2 = BF.minifyHTML('<style>\n.a { color: red; }\n</style>');
  ok(min2.indexOf('.a { color: red; }') >= 0, 'minifyHTML: style content kept raw');
})();

/* ---------- JSON ---------- */
(function () {
  eq(BF.formatJSON('{"a":1,"b":[2,3]}'), '{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}', 'formatJSON: 2-space indent');
  eq(BF.minifyJSON('{ "a" : 1 , "b" : [ 2, 3 ] }'), '{"a":1,"b":[2,3]}', 'minifyJSON');
  let threw = false;
  try { BF.formatJSON('{bad'); } catch (e) { threw = true; }
  ok(threw, 'formatJSON: invalid input throws');
})();

/* ---------- detect ---------- */
(function () {
  eq(BF.detect('{"a":1}'), 'json', 'detect: json object');
  eq(BF.detect('[1,2,3]'), 'json', 'detect: json array');
  eq(BF.detect('<!DOCTYPE html><html></html>'), 'html', 'detect: doctype html');
  eq(BF.detect('<div>x</div>'), 'html', 'detect: tag html');
  eq(BF.detect('.a{color:red}'), 'css', 'detect: css rule');
  eq(BF.detect('function f(){return 1}'), 'js', 'detect: js function');
  eq(BF.detect('const x = {a:1};'), 'js', 'detect: js object literal not css');
})();

/* ---------- process + stats ---------- */
(function () {
  const r = BF.process('{"a": 1}', 'auto', 'minify');
  eq(r.lang, 'json', 'process: auto-detect lang');
  eq(r.output, '{"a":1}', 'process: minify output');

  const r2 = BF.process('.a{x:1}', 'css', 'format');
  ok(r2.output.indexOf('.a {') >= 0, 'process: explicit lang');

  const s = BF.stats('aaaaaaaaaa', 'aaaaa');
  eq(s.before, 10, 'stats: before');
  eq(s.after, 5, 'stats: after');
  eq(s.saved, 5, 'stats: saved');
  eq(s.ratio, 50, 'stats: ratio');

  let threw = false;
  try { BF.process('x', 'nope', 'format'); } catch (e) { threw = true; }
  ok(threw, 'process: unknown lang throws');
})();

/* ---------- self-host smoke: format own kernel and it still runs ---------- */
(function () {
  const kernel = m[1];
  const min = BF.minifyJS(kernel);
  ok(min.length < kernel.length, 'selfhost: minified kernel is smaller');
  const mod2 = { exports: {} };
  let okRun = true;
  try {
    new Function('module', 'exports', 'require', min)(mod2, mod2.exports, require);
    okRun = typeof mod2.exports.formatJS === 'function' &&
      mod2.exports.minifyJSON('{ "k" : 1 }') === '{"k":1}';
  } catch (e) { okRun = false; console.error('  selfhost error: ' + e.message); }
  ok(okRun, 'selfhost: minified kernel still executes and works');
})();

console.log('BeautifyForge tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail === 0 ? 0 : 1);
