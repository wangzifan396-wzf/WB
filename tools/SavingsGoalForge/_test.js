
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-3);}
ok('req zero rate', near(A.requiredMonthly(0,0,12,1200), 100));
ok('req finite', isFinite(A.requiredMonthly(20000,0.03,36,200000)));
// 反向一致性
var need=A.requiredMonthly(20000,0.03,36,200000);
ok('inverse req', near(A.monthsToGoal(20000, need, 0.03, 200000), 36, 1e-3));
ok('months zero rate', near(A.monthsToGoal(0,100,0,1200), 12, 1e-6));
console.log('SavingsGoalForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
