
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('8h', A.sleepTime('23:00','07:00').hours===8);
ok('cross', A.sleepTime('01:00','09:00').hours===8);
ok('7h', A.sleepTime('22:00','05:00').minutes===420);
ok('lack', A.sleepTime('01:00','06:00').quality==='睡眠不足');
ok('err', !!A.sleepTime('x','07:00').error);
console.log('SleepTimeForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
