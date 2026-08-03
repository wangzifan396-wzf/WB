const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('f16known', C.f16('abcde').value==='05c301ef');
ok('f16empty', C.f16('').value==='00000000');
ok('f16same', C.f16('abc').value===C.f16('abc').value);
ok('f32same', C.f32('abcd').value===C.f32('abcd').value);
ok('f32empty', C.f32('').value==='00000000');
console.log((fail?'FAIL':'PASS')+' FletcherForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);