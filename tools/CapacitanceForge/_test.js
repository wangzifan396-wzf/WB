
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('EPS0=8.854e-12', A.EPS0===8.854e-12);
ok('parallelPlate(1e-4,1e-3)=8.854e-13', Math.abs(A.parallelPlate(1e-4,1e-3)-8.854e-13)<1e-20);
ok('parallelPlate with er=2', Math.abs(A.parallelPlate(1e-4,1e-3,2)-2*8.854e-13)<1e-20);
ok('parallel([1e-6,2e-6])=3e-6', A.parallel([1e-6,2e-6])===3e-6);
ok('series([1e-6,2e-6])=6.666e-7', Math.abs(A.series([1e-6,2e-6])-2e-6/3)<1e-20);
console.log('CapacitanceForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
