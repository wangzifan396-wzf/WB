
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nthRoot(16,4)=2', Math.abs(A.nthRoot(16,4)-2)<1e-9);
ok('nthRoot(32,5)=2', Math.abs(A.nthRoot(32,5)-2)<1e-9);
ok('cbrt(27)=3', Math.abs(A.cbrt(27)-3)<1e-12);
ok('sqrt(25)=5', Math.abs(A.sqrt(25)-5)<1e-12);
ok('nthRoot(-1,2)=NaN', isNaN(A.nthRoot(-1,2)));
console.log('NthRootForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
