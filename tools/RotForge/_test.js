const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('c1', C.caesar('abc',1)==='bcd');
ok('cz', C.caesar('z',1)==='a');
ok('r13', C.rot13('Hello')==='Uryyb');
ok('at', C.atbash('abc')==='zyx');
ok('rt', C.caesar(C.caesar('xyz',5),-5)==='xyz');
console.log((fail?'FAIL':'PASS')+' RotForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);