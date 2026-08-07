
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.quartiles([1,2,3,4,5,6,7,8,9,10]);
ok('Q1=3.25', Math.abs(r.q1-3.25)<1e-9);
ok('Q2=5.5', Math.abs(r.q2-5.5)<1e-9);
ok('Q3=7.75', Math.abs(r.q3-7.75)<1e-9);
ok('IQR=4.5', Math.abs(r.iqr-4.5)<1e-9);
ok('mean([1..5])=3', A.mean([1,2,3,4,5])===3);
console.log('QuartileForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
