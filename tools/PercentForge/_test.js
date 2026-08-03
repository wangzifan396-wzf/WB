const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('of', C.of('200','10').value==='20');
ok('what', C.what('50','200').value==='25');
ok('change', C.change('100','150').value==='50');
ok('change2', C.change('100','50').value==='-50');
ok('diff', C.diff('100','150').value==='40');
ok('bad', !!C.of('x','10').error);
console.log((fail?'FAIL':'PASS')+' PercentForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);