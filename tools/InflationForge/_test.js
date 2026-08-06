
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-4);}
ok('future', near(A.futureNominal(100,0.03,10), 134.3916, 1e-3));
ok('real inverse', near(A.realValue(134.3916,0.03,10), 100, 1e-3));
ok('loss', near(A.lossPct(0.03,10), 25.5906, 1e-2));
ok('realRate', near(A.realRate(0.05,0.03), 0.019417, 1e-5));
console.log('InflationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
