
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.flip(10,0.5,C.rngFrom(5));ok('sum',r.value.heads+r.value.tails===10);ok('len',r.value.sequence.length===10);
var r2=C.flip(1,1);ok('bias1',r2.value.heads===1&&r2.value.tails===0);
var r3=C.flip(1,0);ok('bias0',r3.value.heads===0&&r3.value.tails===1);
console.log((fail?'FAIL':'PASS')+' CoinForge '+pass+'/'+fail);process.exit(fail?1:0);
