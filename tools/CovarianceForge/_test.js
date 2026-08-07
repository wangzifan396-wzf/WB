
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var cs=A.covSample([1,2,3,4],[1,3,5,7]); // products:4.5+0.5+0.5+4.5=10 /3 =3.3333
ok('covSample([1,2,3,4],[1,3,5,7])~3.3333', Math.abs(cs-10/3)<1e-9);
ok('covSample identical = variance', Math.abs(A.covSample([1,2,3],[1,2,3])-1)<1e-9);
ok('covPop([1,2,3,4],[1,3,5,7])~2.5', Math.abs(A.covPop([1,2,3,4],[1,3,5,7])-2.5)<1e-9);
ok('mismatch NaN', isNaN(A.covSample([1,2],[3,4,5])));
console.log('CovarianceForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
