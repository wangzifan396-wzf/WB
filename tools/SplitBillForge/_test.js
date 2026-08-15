
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('basic', (function(){var r=A.split(100,4,10,0); return Math.abs(r.grand-110)<1e-9 && Math.abs(r.per-27.5)<1e-9 && Math.abs(r.tip-10)<1e-9;})());
ok('tax', (function(){var r=A.split(200,2,0,10); return Math.abs(r.tax-20)<1e-9 && Math.abs(r.grand-220)<1e-9;})());
ok('people', A.split(100,4,10,0).people===4);
console.log('SplitBillForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
