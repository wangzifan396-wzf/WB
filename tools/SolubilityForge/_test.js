
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('AgCl Ksp s=sqrt(1.8e-10)', Math.abs(A.molarSolubility(1.8e-10,1,1)-1.34164e-5)<1e-9);
ok('CaF2 Ksp s~2.136e-4', Math.abs(A.molarSolubility(3.9e-11,1,2)-2.1364e-4)<1e-7);
ok('ksp AgCl from s', Math.abs(A.ksp(1.34164e-5,1.34164e-5,1,1)-1.8e-10)<1e-14);
console.log('SolubilityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
