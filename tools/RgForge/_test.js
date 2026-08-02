
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var t='a ERROR x\nb warn y\nc error z';
var r=C.search(t,'error|warn','i').value; ok('ci', r.length===3);
var r2=C.search(t,'^a').value; ok('match', r2.length===1 && r2[0].n===1);
ok('bad', !!C.search(t,'(').error);
var r3=C.search(t,'ERROR').value; ok('nocase', r3.length===1);
console.log((fail?'FAIL':'PASS')+' RgForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);