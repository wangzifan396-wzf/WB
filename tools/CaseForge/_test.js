// CaseForge _test.js — extracts the first <script> from index.html and asserts pure functions.
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
function eqArr(a, b){ return JSON.stringify(a) === JSON.stringify(b); }

ok('toCamel', P.toCamel('hello world') === 'helloWorld');
ok('toCamel dashed', P.toCamel('Hello-World') === 'helloWorld');
ok('toCamel camel-in', P.toCamel('helloWorld') === 'helloWorld');
ok('toPascal', P.toPascal('hello world') === 'HelloWorld');
ok('toSnake', P.toSnake('helloWorld') === 'hello_world');
ok('toKebab', P.toKebab('helloWorld') === 'hello-world');
ok('toConstant', P.toConstant('hello world') === 'HELLO_WORLD');
ok('toTrain', P.toTrain('hello world') === 'Hello-World');
ok('toDot', P.toDot('hello world') === 'hello.world');
ok('toPath', P.toPath('hello world') === 'hello/world');
ok('toTitle', P.toTitle('hello world foo') === 'Hello World Foo');
ok('toSentence', P.toSentence('HELLO WORLD') === 'Hello world');
ok('splitWords', eqArr(P.splitWords('helloWorld'), ['hello', 'World']));
ok('splitWords mixed', eqArr(P.splitWords('Hello World-foo_bar'), ['Hello', 'World', 'foo', 'bar']));

const st = P.countStats('a b\nc');
ok('count chars', st.chars === 5);
ok('count noSpace', st.charsNoSpace === 3);
ok('count words', st.words === 3);
ok('count lines', st.lines === 2);
ok('count bytes', st.bytes === 5);

ok('dedupe', P.dedupeLines('a\na\nb') === 'a\nb');
ok('sort', P.sortLines('c\na\nb') === 'a\nb\nc');
ok('sort desc', P.sortLines('a\nc\nb', { dir: 'desc' }) === 'c\nb\na');
ok('prefix', P.prefixLines('a\nb', '> ') === '> a\n> b');
ok('suffix', P.suffixLines('a\nb', ' ;') === 'a ;\nb ;');
ok('number', P.numberLines('a\nb') === '1\ta\n2\tb');
ok('reverse', P.reverseLines('a\nb') === 'b\na');
ok('trim', P.trimLines('  a  \n b ') === 'a\nb');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
