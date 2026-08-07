
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('118/76 Normal', A.categorize(118,76).level===0);
ok('125/78 Elevated', A.categorize(125,78).level===1);
ok('135/85 Stage1', A.categorize(135,85).level===2);
ok('145/95 Stage2', A.categorize(145,95).level===3);
ok('185/125 Crisis', A.categorize(185,125).level===4);
console.log('BloodPressureForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
