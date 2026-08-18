
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('fmt', A.fmt(125)==='02:05' && A.fmt(0)==='00:00');
ok('phases', A.buildPhases(1200,20,8).phases.length===16);
ok('clamp', A.buildPhases(99999,20,8).workSec===3600);
ok('break', A.buildPhases(1200,99999,8).breakSec===600);
console.log('RestReminderForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
