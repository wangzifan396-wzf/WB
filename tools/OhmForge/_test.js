
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.solve({v:10,i:2});ok('r',r.value.r===5);ok('p',r.value.p===20);
var r2=C.solve({i:2,r:5});ok('v',r2.value.v===10);ok('p2',r2.value.p===20);
var r3=C.solve({v:1});ok('few',r3.error!=null);
console.log((fail?'FAIL':'PASS')+' OhmForge '+pass+'/'+fail);process.exit(fail?1:0);
