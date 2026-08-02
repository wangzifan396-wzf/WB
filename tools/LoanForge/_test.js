
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);
const mod={exports:{}};
new Function('module','exports','require',m[1])(mod,mod.exports,require);
const P=mod.exports;
let n=0; function ok(c,msg){ if(!c){ console.error('FAIL: '+msg); process.exit(1);} n++; }
const close=function(a,b,e){ return Math.abs(a-b)<(e||1e-6); };
ok(P.loanParseNum('1,000')===1000,'parse comma');
ok(P.loanParseNum(' 2500 ').valueOf()===2500,'parse spaces');
const z=P.loanSchedule(120000,0,12);
ok(z.error===null && close(z.monthly,10000),'zero rate monthly');
ok(z.totalInterest===0,'zero rate no interest');
const a=P.loanSchedule(100000,5,12);
ok(a.error===null && a.monthly>8500 && a.monthly<8600,'monthly range');
ok(close(a.monthly*12, a.totalPay,1),'total = monthly*12');
ok(a.totalInterest>0,'interest positive');
ok(close(a.schedule[a.schedule.length-1].balance,0,0.5),'final balance ~0');
ok(P.loanSchedule(-5,5,12).error!==null,'neg principal');
ok(P.loanSchedule(100000,5,0).error!==null,'zero months');
ok(P.loanSchedule('abc',5,12).error!==null,'bad principal');
console.log('PASS '+n+' assertions');
