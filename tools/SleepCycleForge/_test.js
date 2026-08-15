
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('add',A.addMinutes('23:00',90)==='00:30');
ok('addw',A.addMinutes('23:00',450)==='06:30');
ok('cycles',A.cyclesBetween('23:00','07:00')===5);
ok('rec',A.recommendedWake('23:00',5)==='06:30');
ok('fmt',A.fmt(1470)==='00:30');
ok('err',A.parseHM('99:00')===null);
console.log('SleepCycleForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
