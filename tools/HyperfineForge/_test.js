
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.bench('var s=0;for(var i=0;i<100;i++)s+=i;return s;', 20).value;
ok('iters', r.times.length===20);
ok('order', r.min<=r.mean && r.mean<=r.max);
ok('median', typeof r.median==='number');
ok('std', r.stddev>=0);
console.log((fail?'FAIL':'PASS')+' HyperfineForge '+pass+'/'+(pass+fail));process.exit(fail?1:0);