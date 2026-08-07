
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('90 Normal', A.categorizeFasting(90).level===0);
ok('110 Prediabetes', A.categorizeFasting(110).level===1);
ok('130 Diabetes', A.categorizeFasting(130).level===2);
ok('toMmol(90)~5', Math.abs(A.toMmol(90)-5)<1e-9);
console.log('BloodSugarForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
