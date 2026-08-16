
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('add',A.addDays('2026-01-01',31)==='2026-02-01');
ok('diff',A.diffDays('2026-01-01','2026-01-31')===30);
ok('wd',A.weekday('2026-01-01')==='周四');
ok('dim',A.daysInMonth(2026,2)===28);
console.log('CalendarForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
