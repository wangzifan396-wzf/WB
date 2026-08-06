
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-3);}
ok('principal only', near(A.compound(1000,0.05,10,1,0).futureValue, 1628.8946, 1e-3));
ok('zero rate annuity', near(A.compound(0,0,10,12,100).futureValue, 12000));
ok('contrib = pmt*ny', near(A.compound(0,0.05,10,12,100).contributions, 12000));
ok('interest positive', A.compound(0,0.05,10,12,100).interest > 3000);
ok('principal growth', near(A.compound(1000,0.05,10,1,0).principalGrowth, 628.8946, 1e-3));
console.log('CompoundForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
