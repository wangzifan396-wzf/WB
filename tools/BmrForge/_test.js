
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mifflin(70,175,30,M)=1648.75', Math.abs(A.mifflin(70,175,30,'M')-1648.75)<1e-9);
ok('mifflin female -161', Math.abs(A.mifflin(70,175,30,'F')-(1648.75-166))<1e-9);
ok('harris(70,175,30,M)~1700.67', Math.abs(A.harris(70,175,30,'M')-1700.667)<1e-2);
ok('tdee(bmr,1.2)', Math.abs(A.tdee(1600,1.2)-1920)<1e-9);
ok('tdee default 1.2', Math.abs(A.tdee(1600)-1920)<1e-9);
console.log('BmrForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
