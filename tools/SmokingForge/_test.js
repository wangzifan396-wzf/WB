
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1);}
ok('cost', near(A.cost(1,30,10), 109500));
ok('packYears', near(A.packYears(1,10), 10));
ok('lifeLost', near(A.lifeLostMin(1,10), 803000));
ok('savings', near(A.savingsIfQuit(1,30,10), 109500));
console.log('SmokingForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
