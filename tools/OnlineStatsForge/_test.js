
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.welford([2,4,4,4,5,5,7,9]);
ok('mean 5', Math.abs(r.mean-5)<1e-9);
ok('var 32/7', Math.abs(r.variance-32/7)<1e-9);
ok('n 8', r.n===8);
console.log('OnlineStatsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
