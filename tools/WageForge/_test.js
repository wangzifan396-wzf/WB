
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('annual', near(A.annual(50,40,52), 104000));
ok('hourly inverse', near(A.hourly(104000,40,52), 50));
ok('monthly', near(A.monthly(120000), 10000));
ok('weekly', near(A.weekly(104000,52), 2000));
ok('div0', A.hourly(100,0,52)===null);
console.log('WageForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
