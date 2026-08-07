
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nCr(5,2)=10', A.nCr(5n,2n)===10n);
ok('nCr(10,0)=1', A.nCr(10n,0n)===1n);
ok('pmf(2,1,0.5)=0.5', Math.abs(A.pmf(2,1,0.5)-0.5)<1e-12);
ok('cdf(2,2,0.5)=1', Math.abs(A.cdf(2,2,0.5)-1)<1e-12);
ok('cdf(2,0,0.5)=0.25', Math.abs(A.cdf(2,0,0.5)-0.25)<1e-12);
console.log('BinomialForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
