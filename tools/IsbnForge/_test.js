const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('v13', C.is13('9783161484100')===true);
ok('i13', C.is13('9783161484101')===false);
ok('v10', C.is10('0306406152')===true);
ok('t13', C.to13('0306406152').value==='9780306406157');
ok('t10', C.to10('9780306406157').value==='0306406152');
ok('bad', !!C.to13('123').error);
console.log((fail?'FAIL':'PASS')+' IsbnForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);