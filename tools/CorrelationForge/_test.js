
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('perfect positive r=1', Math.abs(A.pearson([1,2,3,4,5],[2,4,6,8,10])-1)<1e-9);
ok('perfect negative r=-1', Math.abs(A.pearson([1,2,3,4,5],[5,4,3,2,1])+1)<1e-9);
ok('partial positive r~0.9449', Math.abs(A.pearson([1,2,3,4,5],[1,1,2,2,3])-0.9449)<0.01);
ok('length mismatch NaN', isNaN(A.pearson([1,2],[3,4,5])));
console.log('CorrelationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
