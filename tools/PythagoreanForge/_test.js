
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('hypot(3,4)=5', Math.abs(A.hypot(3,4)-5)<1e-12);
ok('leg(5,3)=4', Math.abs(A.leg(5,3)-4)<1e-12);
ok('isRight(3,4,5)', A.isRight(3,4,5)===true);
ok('isRight(1,1,1)=false', A.isRight(1,1,1)===false);
console.log('PythagoreanForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
