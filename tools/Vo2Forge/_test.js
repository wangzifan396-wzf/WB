
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('vo2Resting(30,60) Fox', Math.abs(A.vo2Resting(30,60)-15.3*(190/60))<1e-6);
ok('vo2Run15(12)=43.75', Math.abs(A.vo2Run15(12)-43.75)<1e-9);
ok('vo2Resting tanaka', Math.abs(A.vo2Resting(30,60,'tanaka')-15.3*(187/60))<1e-6);
console.log('Vo2Forge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
