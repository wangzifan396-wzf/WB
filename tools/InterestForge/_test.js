const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); if(!m){console.error('NO SCRIPT');process.exit(1);}
const fn=new Function('module','exports','require',m[1]); fn(module,module.exports,require);
const A=module.exports; let pass=0,fail=0;
function ok(n,c){ if(c) pass++; else { fail++; console.error('  FAIL: '+n); } }
var c1=A.compound(1000,0.05,1);
ok('compound fv', Math.abs(c1.futureValue-1050)<1e-6);
ok('compound interest', Math.abs(c1.interest-50)<1e-6);
var c2=A.compound(1000,0.12,1,{frequency:12});
ok('compound monthly', Math.abs(c2.futureValue-1126.825)<0.01);
ok('compound invalid principal', A.compound(-1,0.05,1).error!==undefined);
ok('compound invalid years', A.compound(1000,0.05,0).error!==undefined);
var a1=A.amortize(12000,0.06,1);
ok('amort monthly > principal/n', a1.monthlyPayment>1000 && a1.monthlyPayment<1035);
var a2=A.amortize(1200,0,1);
ok('amort zero rate payment', a2.monthlyPayment===100 && a2.totalPayment===1200);
ok('amort schedule length', A.amortize(12000,0.06,2).schedule.length===24);
var a3=A.amortize(12000,0.06,1);
ok('amort last balance ~0', a3.schedule[a3.schedule.length-1].balance<0.5);
ok('amort total interest', a3.totalInterest>0 && Math.abs(a3.totalInterest-(a3.monthlyPayment*12-12000))<1);
ok('amort invalid principal', A.amortize(0,0.06,1).error!==undefined);
var a4=A.amortize(1200,0,1);
ok('amort zero rate interest 0', a4.totalInterest===0);
console.log('InterestForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
