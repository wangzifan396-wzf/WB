// YamlForge _test.js — extracts the first <script> from index.html and asserts pure functions.
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.error('FAIL: no <script> found'); process.exit(1); }
let mod = { exports: {} };
const fn = new Function('module', 'exports', 'require', m[1]);
fn(mod, mod.exports, require);
const P = mod.exports;

let pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log('PASS', name); }
  else { fail++; console.error('FAIL', name); }
}
function deepEq(a, b){ return JSON.stringify(a) === JSON.stringify(b); }

const sample = `name: John
age: 30
admin: true
scores:
  - 90
  - 85
  - 100
address:
  city: NYC
  zip: "10001"
notes:
  - title: Hello
    body: World
  - title: Hi
    body: There
empty: ~
quote: "say: hi"`;

const expected = {
  name: 'John', age: 30, admin: true,
  scores: [90, 85, 100],
  address: { city: 'NYC', zip: '10001' },
  notes: [ { title: 'Hello', body: 'World' }, { title: 'Hi', body: 'There' } ],
  empty: null,
  quote: 'say: hi'
};

ok('parseYaml sample', deepEq(P.parseYaml(sample), expected));
ok('parseYaml scalar seq', deepEq(P.parseYaml('- 1\n- 2\n- 3'), [1, 2, 3]));
ok('parseYaml empty -> null', P.parseYaml('') === null);
ok('parseYaml empty doc -> null', P.parseYaml('   \n  # comment\n') === null);
ok('parseYaml quoted colon', deepEq(P.parseYaml('a: 1\nb: "x: y"'), { a: 1, b: 'x: y' }));
ok('parseScalar int', P.parseScalar('42') === 42);
ok('parseScalar float', P.parseScalar('3.14') === 3.14);
ok('parseScalar bool', P.parseScalar('true') === true);
ok('parseScalar null', P.parseScalar('~') === null);
ok('parseScalar str', P.parseScalar('hello') === 'hello');

// round-trip
const obj = { name: 'John', age: 30, list: [1, 2, 3], nested: { x: 'a: b', y: [true, false, null] }, s: 'value with: colon' };
ok('roundtrip parse(toYaml)', deepEq(P.parseYaml(P.toYaml(obj)), obj));

ok('jsonToYaml', P.jsonToYaml('{"a":1}').indexOf('a: 1') >= 0);
ok('yamlToJson', (function(){ try{ var j = JSON.parse(P.yamlToJson(sample)); return j.name === 'John' && j.scores.length === 3; }catch(e){ return false; } })());

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
