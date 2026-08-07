
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gnth(2,3,4)=54', Math.abs(A.gnth(2,3,4)-54)<1e-12);
ok('gsum(2,3,4)=80', Math.abs(A.gsum(2,3,4)-80)<1e-12);
ok('gsum(1,2,10)=1023', Math.abs(A.gsum(1,2,10)-1023)<1e-12);
ok('gsum(1,1,5)=5', Math.abs(A.gsum(1,1,5)-5)<1e-12);
console.log('GeometricForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
