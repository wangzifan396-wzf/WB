
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-4);}
ok('mifflin m', near(A.mifflin('m',80,180,30), 1780));
ok('harris m',  near(A.harris('m',80,180,30), 1853.632, 1e-2));
ok('tdee sed',  near(A.tdee(1780,'sedentary'), 2136));
ok('goal lose', near(A.goalCalories(2000,'-0.5'), 1450));
ok('goal gain', near(A.goalCalories(2000,'0.5'), 2550));
console.log('TdeeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
