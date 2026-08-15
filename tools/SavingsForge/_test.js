
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('fv0',A.futureValue(100,0,12)===1200);
ok('m0',A.monthsToGoal(1200,100,0)===12);
ok('fv1',Math.abs(A.futureValue(100,0.12,1)-100)<1e-9);
ok('m1',Math.abs(A.monthsToGoal(A.futureValue(100,0.12,12),100,0.12)-12)<1e-6);
console.log('SavingsForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
