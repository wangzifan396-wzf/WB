
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var g=C.gron('{"a":1,"b":[true,"x"]}').value;
ok('scalar', g.indexOf('json.a = 1;')>=0);
ok('arr', g.indexOf('json.b[0] = true;')>=0);
ok('str', g.indexOf('json.b[1] = "x";')>=0);
ok('bad', !!C.gron('{bad').error);
console.log((fail?'FAIL':'PASS')+' GronForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);