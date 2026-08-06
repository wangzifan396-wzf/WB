
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var lmp=new Date(2026,0,1);
ok('ov 14', (A.ovulation(lmp,28)-lmp)/86400000 === 14);
var fw=A.fertileWindow(lmp,28);
ok('fwin start', (fw.start-lmp)/86400000 === 9);
ok('fwin end',   (fw.end-lmp)/86400000 === 15);
console.log('OvulationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
