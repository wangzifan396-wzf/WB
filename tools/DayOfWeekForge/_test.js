
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mon', A.dayOfWeek(2026,8,17).name==='周一');
ok('sun', A.dayOfWeek(2026,8,16).name==='周日');
ok('thu', A.dayOfWeek(2026,1,1).index===4);
ok('err', !!A.dayOfWeek(0,0,0).error);
console.log('DayOfWeekForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
