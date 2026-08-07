
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pi ~3.14', Math.abs(A.estimatePi(200000,7)-Math.PI)<0.05);
ok('int x^2 ~1/3', Math.abs(A.integrate(function(x){return x*x;},0,1,200000,3)-1/3)<0.01);
ok('deterministic seed', A.estimatePi(1000,5)===A.estimatePi(1000,5));
console.log('MonteCarloForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
