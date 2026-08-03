
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
ok('str', C.select('{"a":{"b":[10,20]}}','.a.b[1]').value.trim()==='20');
ok('num', C.select('{"x":5}','.x').value.trim()==='5');
ok('bool', C.select('{"ok":true}','.ok').value.trim()==='true');
ok('bad', !!C.select('{bad','.x').error);
ok('miss', !!C.select('{"a":1}','.z').error);
ok('path', C.parsePath('.a.b[0].c').length===4);
console.log((fail?'FAIL':'PASS')+' DaselForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);