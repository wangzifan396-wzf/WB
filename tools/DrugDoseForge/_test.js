
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('daily', A.doseCalc(10,5,2).dailyDose===50);
ok('per', A.doseCalc(10,5,2).perDose===25);
ok('vol', A.doseCalc(10,5,2,10).volumeMl===2.5);
ok('err', !!A.doseCalc(0,5,2).error);
console.log('DrugDoseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
