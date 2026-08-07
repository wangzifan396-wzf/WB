
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('factorial(5)=120', A.factorial(5)===120);
ok('factorial(0)=1', A.factorial(0)===1);
ok('perm(5,2)=20', A.perm(5,2)===20);
ok('comb(5,2)=10', A.comb(5,2)===10);
ok('comb(52,5)=2598960', A.comb(52,5)===2598960);
ok('binomP(10,3,0.5)=120/1024', Math.abs(A.binomP(10,3,0.5)-120/1024)<1e-9);
ok('binomAtLeast(10,8,0.5)', Math.abs(A.binomAtLeast(10,8,0.5)-(45+10+1)/1024)<1e-9);
console.log('ProbabilityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
