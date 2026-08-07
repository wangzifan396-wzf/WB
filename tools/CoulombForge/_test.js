
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('force(1e-6,1e-6,1)~8.9875e-3', Math.abs(A.force(1e-6,1e-6,1)-8.9875517923e-3)<1e-9);
ok('force opposite sign negative', A.force(1e-6,-1e-6,1)<0);
ok('force r<=0 NaN', isNaN(A.force(1,1,0)));
console.log('CoulombForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
