
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var d=[2,4,4,4,5,5,7,9];
ok('mean', Math.abs(A.mean(d)-5)<1e-9);
ok('median even', A.median([1,2,3,4])===2.5);
ok('median odd', A.median([1,2,3])===2);
ok('mode', A.mode([1,1,2,3])===1);
ok('variance=4', Math.abs(A.variance(d)-4)<1e-9);
ok('stddev=2', Math.abs(A.stddev(d)-2)<1e-9);
console.log('StatisticsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
