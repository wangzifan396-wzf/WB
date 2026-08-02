
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var st=C.stats([10,20,30,40]).value; ok('avg', st.avg===25);
ok('min', st.min===10); ok('max', st.max===40);
ok('empty', C.stats([]).value.count===0);
console.log((fail?'FAIL':'PASS')+' LatencyForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);