const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('13', C.pick('a,b,c\nd,e,f','1,3',',').value==='a,c\nd,f');
ok('range', C.pick('a,b,c','2-3',',').value==='b,c');
ok('bad', !!C.pick('a,b','x',',').error);
ok('parse', Object.keys(C.parseFields('1,3-4')).length===3);
console.log((fail?'FAIL':'PASS')+' ChooseForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);