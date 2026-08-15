
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('due',A.dueDate('2025-01-01')==='2025-10-08');
ok('add',A.addDays('2025-02-28',1)==='2025-03-01');
ok('wk',A.weeksBetween('2025-01-01','2025-01-08')===1);
ok('gest',A.gestation('2025-01-01','2025-04-01').weeks===12);
ok('tri',A.gestation('2025-01-01','2025-04-01').trimester===1);
ok('err',A.dueDate('bad')===null);
console.log('DueDateForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
