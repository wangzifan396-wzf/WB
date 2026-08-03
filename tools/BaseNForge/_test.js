const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('16-10', C.conv('ff',16,10).value==='255');
ok('10-2', C.conv('255',10,2).value==='11111111');
ok('2-10', C.conv('1010',2,10).value==='10');
ok('36-10', C.conv('z',36,10).value==='35');
ok('neg', C.conv('-ff',16,10).value==='-255');
ok('bad', !!C.conv('g',16,10).error);
console.log((fail?'FAIL':'PASS')+' BaseNForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);