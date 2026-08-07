
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('computeTax(10000)=1000', Math.abs(A.computeTax(10000)-1000)<1e-9);
ok('computeTax(50000)=6307.5', Math.abs(A.computeTax(50000)-6307.5)<1e-6);
ok('marginalRate(50000)=0.22', A.marginalRate(50000)===0.22);
ok('marginalRate(5000)=0.10', A.marginalRate(5000)===0.10);
ok('effectiveRate(50000)~0.12615', Math.abs(A.effectiveRate(50000)-0.12615)<1e-3);
ok('computeTax(0)=0', A.computeTax(0)===0);
console.log('TaxForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
