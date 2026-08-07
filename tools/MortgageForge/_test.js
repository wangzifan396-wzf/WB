
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('monthlyPayment 200k@5%/30y ~1073.64', Math.abs(A.monthlyPayment(200000,5,30)-1073.64)<1);
ok('monthlyPayment 0% = P/n', Math.abs(A.monthlyPayment(120000,0,10)-1000)<1e-9);
ok('totalPaid = M*360', Math.abs(A.totalPaid(200000,5,30)-A.monthlyPayment(200000,5,30)*360)<1e-6);
ok('totalInterest = paid-P', Math.abs(A.totalInterest(200000,5,30)-(A.totalPaid(200000,5,30)-200000))<1e-6);
var s=A.schedule(200000,5,30); ok('schedule 360 rows', s.length===360 && Math.abs(s[359].balance)<1e-6);
console.log('MortgageForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
