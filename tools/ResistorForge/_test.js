
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.bandsToValue(['brown','black','red','gold']);ok('4band ohms',r.value.ohms===1000);ok('4band tol',r.value.tolerance===5);
var r2=C.bandsToValue(['red','red','red','gold']);ok('222',r2.value.ohms===2200);
var rv=C.valueToBands(1000,5);ok('v2b',rv.value.join(',')==='brown,black,red,gold');
console.log((fail?'FAIL':'PASS')+' ResistorForge '+pass+'/'+fail);process.exit(fail?1:0);
