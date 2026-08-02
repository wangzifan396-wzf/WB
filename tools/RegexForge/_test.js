/* RegexForge kernel tests - Node, no deps. Extracts first <script> body via new Function. */
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('no script found'); process.exit(1); }
const mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', m[1]);
fn(mod, mod.exports, require);
const RF = mod.exports;

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }
function eq(name, a, b) { ok(name + ' (' + JSON.stringify(a) + '===' + JSON.stringify(b) + ')', a === b); }

// exports
ok('exports.parse', typeof RF.parse === 'function');
ok('exports.run', typeof RF.run === 'function');
ok('exports.renderHL', typeof RF.renderHL === 'function');
ok('exports.version', RF.version() === '1.0.0');

// parse: simple literal
let p = RF.parse('abc');
ok('parse abc ast', p.ast && p.ast.type === 'seq');
ok('parse abc items', p.ast.items.length === 3);

// parse: group + quantifier
p = RF.parse('(ab)+c');
ok('parse group type', p.ast.items[0].type === 'quant');
ok('parse group inner', p.ast.items[0].token.type === 'group');
eq('parse group quant min', p.ast.items[0].min, 1);
eq('parse group quant max', p.ast.items[0].max, Infinity);

// parse: alternation
p = RF.parse('a|b|c');
ok('parse alt', p.ast.type === 'alt' && p.ast.options.length === 3);

// parse: char class neg
p = RF.parse('[^0-9]+');
ok('parse class neg', p.ast.items[0].token.type === 'charclass' && p.ast.items[0].token.neg === true);

// parse: named group (no trailing quantifier -> direct group node)
p = RF.parse('(?<user>\\w+)@(?<domain>\\w+)');
ok('parse named group', p.ast.items[0].type === 'group' && p.ast.items[0].kind === 'named');
eq('parse named name', p.ast.items[0].name, 'user');

// parse: lookahead
p = RF.parse('\\d(?=px)');
ok('parse lookahead', p.ast.items[1].type === 'group' && p.ast.items[1].kind === 'lookahead');

// parse: brace quantifier
p = RF.parse('a{2,4}');
ok('parse brace quant', p.ast.items[0].type === 'quant' && p.ast.items[0].min === 2 && p.ast.items[0].max === 4);

// parse: non-greedy
p = RF.parse('a+?');
ok('parse non-greedy', p.ast.items[0].type === 'quant' && p.ast.items[0].greedy === false);

// parse: error tolerance
p = RF.parse('(unclosed');
ok('parse error returns error', !!p.error);

// run: basic match
let r = RF.run('\\d+', 'g', 'a12b345');
eq('run count', r.matches.length, 2);
eq('run first value', r.matches[0].value, '12');
eq('run first index', r.matches[0].index, 1);

// run: groups
r = RF.run('(\\w+)@(\\w+)', 'g', 'a@b c@d');
eq('run groups count', r.matches.length, 2);
eq('run group0', r.matches[0].groups[0], 'a');
eq('run group1', r.matches[0].groups[1], 'b');

// run: named groups
r = RF.run('(?<user>\\w+)@(?<domain>\\w+)', 'g', 'x@y');
eq('run named user', r.matches[0].named.user, 'x');
eq('run named domain', r.matches[0].named.domain, 'y');

// run: no global -> single
r = RF.run('\\d', '', 'a1b2');
eq('run single', r.matches.length, 1);

// run: invalid regex -> error
r = RF.run('(', 'g', 'x');
ok('run invalid error', !!r.error);

// run: empty text
r = RF.run('\\d', 'g', '');
eq('run empty', r.matches.length, 0);

// highlight: segments
let hl = RF.highlight('a1b', RF.run('\\d', 'g', 'a1b').matches);
eq('hl segs', hl.length, 3);
ok('hl match flag', hl[1].match === true && hl[0].match === false);

// renderHL: html escape
let htmlOut = RF.renderHL('a<b>', RF.run('b', 'g', 'a<b>').matches);
ok('renderHL escapes', htmlOut.indexOf('&lt;') >= 0);

// samples valid
ok('samples array', Array.isArray(RF.samples) && RF.samples.length >= 5);
RF.samples.forEach(function(s){
  let rr = RF.run(s.pat, s.flags, 'sample test 123@example.com https://x.io 192.168.0.1 #fff 2026-01-02 13800138000 my-slug');
  ok('sample runs: ' + s.name, !rr.error);
});

// cheat sheet
ok('cheat array', Array.isArray(RF.cheat) && RF.cheat.length >= 10);

// e2e pipeline: parse -> run -> highlight -> render
let e2e = (function(){
  var pat = '(\\w+)@(\\w+)';
  var parsed = RF.parse(pat);
  if (parsed.error) return false;
  var res = RF.run(pat, 'g', 'a@b c@d');
  if (res.error) return false;
  var out = RF.renderHL('a@b c@d', res.matches);
  return out.indexOf('<mark>') >= 0 && res.matches.length === 2;
})();
ok('e2e pipeline', e2e);

console.log('RegexForge tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
