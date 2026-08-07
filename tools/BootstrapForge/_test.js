
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=[1,2,3,4,5,6,7,8,9,10];
var ci=A.bootstrapCI(s,A.mean,2000,0.05,11);
ok('CI lo<=mean<=hi', ci.lo<=A.mean(s) && A.mean(s)<=ci.hi);
ok('CI finite', isFinite(ci.lo) && isFinite(ci.hi));
ok('deterministic seed', A.bootstrapCI(s,A.mean,500,0.05,9).lo === A.bootstrapCI(s,A.mean,500,0.05,9).lo);
console.log('BootstrapForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
