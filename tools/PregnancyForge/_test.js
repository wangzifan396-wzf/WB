
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var lmp=new Date(2026,0,1);
ok('span 280', (A.dueDate(lmp)-lmp)/86400000 === 280);
ok('t2 98', (A.trimester2(lmp)-lmp)/86400000 === 98);
ok('t3 196',(A.trimester3(lmp)-lmp)/86400000 === 196);
ok('week 20', A.week(lmp, new Date(lmp.getTime()+140*86400000)) === 20);
console.log('PregnancyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
