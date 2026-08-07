
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('to12(13,30)=1:30 PM', A.to12(13,30).str==='1:30 PM');
ok('to12(0,15)=12:15 AM', A.to12(0,15).str==='12:15 AM');
ok('to12(12,0)=12:00 PM', A.to12(12,0).str==='12:00 PM');
ok('to24(1,30,AM)=01:30', A.to24(1,30,'AM').str==='01:30');
ok('to24(1,30,PM)=13:30', A.to24(1,30,'PM').str==='13:30');
ok('to12 invalid null', A.to12(24,0)===null);
console.log('MilitaryTimeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
