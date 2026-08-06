
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-4);}
ok('zero rate', near(A.project(0,100,0,10), 12000));
ok('months', A.months(10)===120);
ok('project finite', isFinite(A.project(1000,200,0.06,30)));
// 反向一致性：requiredMonthly 再 project 应回到 target
var tgt=1000000, c0=50000, r=0.06, y=30;
var need=A.requiredMonthly(c0, tgt, r, y);
ok('inverse', near(A.project(c0, need, r, y), tgt, 1e-3));
console.log('RetireForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
