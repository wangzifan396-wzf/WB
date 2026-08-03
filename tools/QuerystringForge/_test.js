const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var p1=C.parse('a=1&b=2').value;
ok('p1', p1.a==='1' && p1.b==='2');
ok('arr', JSON.stringify(C.parse('a=1&a=2').value.a)==='["1","2"]');
ok('decode', C.parse('x=%E4%B8%AD').value.x==='中');
ok('build', C.build({a:'1',b:'2'}).value==='a=1&b=2');
ok('sort', C.sort('b=2&a=1').value==='a=1&b=2');
console.log((fail?'FAIL':'PASS')+' QuerystringForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);