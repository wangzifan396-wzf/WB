
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.analyze('1 chrome 10 5\n2 node 20 8').value;
ok('rows', r.rows.length===2);
ok('sum', r.totalCpu===30 && r.totalMem===13);
ok('sort', C.sortBy(r.rows,'cpu')[0].name==='node');
ok('parse', C.parse('9 x 1 2').length===1);
console.log((fail?'FAIL':'PASS')+' ProcsForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);