
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('q', near(A.breakeven(1000,10,6).quantity, 250));
ok('revenue', near(A.breakeven(1000,10,6).revenue, 2500));
ok('target', near(A.targetProfitUnits(1000,10,6,1000), 500));
ok('bad margin', A.breakeven(1000,5,6)===null);
console.log('BreakevenForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
