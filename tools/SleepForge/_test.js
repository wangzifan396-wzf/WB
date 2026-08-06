
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('wake', A.wakeMinutes(23*60, 5) === 405); // 06:45
ok('wrap', A.wakeMinutes(23*60, 6) === 495);  // 08:15，跨午夜
ok('debt', Math.round(A.sleepDebt([{need:8,actual:6},{need:8,actual:6},{need:8,actual:6}])) === 6);
console.log('SleepForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
