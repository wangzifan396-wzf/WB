
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('esc', C.esc('a.b')==='a\\.b');
ok('one', C.fromSamples('abc').value==='abc');
ok('empty', !!C.fromSamples('').error);
var r=C.fromSamples('abc\nabd').value; ok('mid', r==='ab[c-d]');
var r2=C.fromSamples('2024-01-01\n2024-02-14\n2024-03-09').value; var re2=new RegExp('^'+r2+'$'); ok('date', re2.test('2024-01-01')&&re2.test('2024-02-14')&&re2.test('2024-03-09'));
ok('alt', C.fromSamples('foo\nbar',{alternation:true}).value==='(foo|bar)');
console.log((fail?'FAIL':'PASS')+' GrexForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);