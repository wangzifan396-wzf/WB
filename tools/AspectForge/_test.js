
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.fromDims(1920,1080);ok('169',r.value.gcd==='16 : 9');
var r2=C.fromDims(800,600);ok('43',r2.value.gcd==='4 : 3');
var r3=C.fromOne(1920,'16:9','w');ok('one',r3.value.h===1080);
console.log((fail?'FAIL':'PASS')+' AspectForge '+pass+'/'+fail);process.exit(fail?1:0);
