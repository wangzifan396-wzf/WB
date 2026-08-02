
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const kernel=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])[0];
const mo={exports:{}};new Function('module','exports',kernel)(mo,mo.exports);
const C=mo.exports;let pass=0,fail=0;
function ok(n,c){if(c)pass++;else{fail++;console.error('FAIL '+n);}}
var r=C.ppi(24,1920,1080);ok('ppi',r.value>91&&r.value<92);
ok('px',C.pxFromInch(96,2)===192);
ok('dpmm',C.dpmm(96)===Math.round(96/25.4*100)/100);
console.log((fail?'FAIL':'PASS')+' DpiForge '+pass+'/'+fail);process.exit(fail?1:0);
