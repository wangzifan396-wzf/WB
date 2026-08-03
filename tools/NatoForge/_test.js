const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('a', C.spell('a')==='Alfa');
ok('abc', C.spell('abc')==='Alfa Bravo Charlie');
ok('num', C.spell('1')==='ONE');
ok('mix', C.spell('A1')==='Alfa ONE');
ok('sym', C.spell('@')==='@');
console.log((fail?'FAIL':'PASS')+' NatoForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);