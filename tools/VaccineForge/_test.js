
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('len', A.schedule('2025-01-01').length===A.SCHED.length);
ok('err', !!A.schedule('bad').error);
ok('due', A.status('2025-01-01','2025-01-01')==='due');
ok('up', A.status('2025-06-01','2025-01-01')==='upcoming');
ok('over', A.status('2024-01-01','2025-01-01')==='overdue');
ok('due2', A.status('2025-02-15','2025-01-15')==='upcoming');
console.log('VaccineForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
