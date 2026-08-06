
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
function near(a,b,t){return Math.abs(a-b)<=(t||1e-6);}
ok('pct', near(A.percentOff(200,20).final, 160));
ok('pct saved', near(A.percentOff(200,20).saved, 40));
ok('fixed', near(A.fixedOff(200,50).final, 150));
ok('bundle', near(A.bundle(10,3,2).total, 20));
ok('bundle per', near(A.bundle(10,3,2).perUnit, 20/3, 1e-9));
ok('tiered hit', near(A.tiered(300,200,15).final, 255));
ok('tiered miss', near(A.tiered(100,200,15).final, 100));
console.log('DiscountForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
