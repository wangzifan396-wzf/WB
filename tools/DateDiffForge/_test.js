
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('daysBetween 1/1->1/31 = 30', A.daysBetween('2024-01-01','2024-01-31')===30);
ok('addDays 1/1 +30 = 1/31', A.addDays('2024-01-01',30)==='2024-01-31');
ok('weekday 2024-01-01 = Mon', A.weekday('2024-01-01')==='Mon');
ok('daysBetween 2023-12-31->2024-01-01 = 1', A.daysBetween('2023-12-31','2024-01-01')===1);
ok('addDays leap 2024-02-28 +1 = 2024-02-29', A.addDays('2024-02-28',1)==='2024-02-29');
console.log('DateDiffForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
