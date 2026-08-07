
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('dopplerSound(1000,34.3,0)=1111.11', Math.abs(A.dopplerSound(1000,34.3,0)-1111.11)<1e-2);
ok('dopplerSound(1000,0,34.3)=1100', Math.abs(A.dopplerSound(1000,0,34.3)-1100)<1e-9);
ok('dopplerLight(500,3e6,c=3e8)=495', Math.abs(A.dopplerLight(500,3e6,3e8)-495)<1e-6);
ok('wavelengthShift(600,3e6,c=3e8)=6', Math.abs(A.wavelengthShift(600,3e6,3e8)-6)<1e-9);
ok('redshiftToSpeed(0.01,c=3e8)=3e6', Math.abs(A.redshiftToSpeed(0.01,3e8)-3e6)<1e-3);
console.log('DopplerForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
