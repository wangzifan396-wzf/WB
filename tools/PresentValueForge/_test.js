
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('pvLump(121,0.1,2)=100', Math.abs(A.pvLump(121,0.1,2)-100)<1e-9);
ok('pvAnnuity(10,0,5)=50', Math.abs(A.pvAnnuity(10,0,5)-50)<1e-9);
ok('pvAnnuity(100,0.1,1)=100/1.1', Math.abs(A.pvAnnuity(100,0.1,1)-100/1.1)<1e-9);
ok('pvLump(1000,0,3)=1000', Math.abs(A.pvLump(1000,0,3)-1000)<1e-9);
console.log('PresentValueForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
