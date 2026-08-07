
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('energy(2,3)=9', Math.abs(A.energy(2,3)-9)<1e-9);
ok('reactance(0.1,50)~31.416', Math.abs(A.reactance(0.1,50)-2*Math.PI*50*0.1)<1e-9);
ok('timeConstant(2,1)=2', Math.abs(A.timeConstant(2,1)-2)<1e-9);
ok('timeConstant R<=0 NaN', isNaN(A.timeConstant(1,0)));
console.log('InductanceForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
