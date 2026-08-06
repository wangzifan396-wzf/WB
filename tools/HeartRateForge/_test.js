
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||5e-2);}
ok('max', near(A.maxHr(30), 187));
var z=A.zone(60,30,0.5,0.6);
ok('zone lo', near(z.lo, 123.5, 0.05));
ok('zone hi', near(z.hi, 136.2, 0.05));
console.log('HeartRateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
