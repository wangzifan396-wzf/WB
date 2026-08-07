
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r0=A.anova([[1,2,3],[1,2,3],[1,2,3]]);
ok('equal groups F~0', r0.F<1e-9);
ok('equal groups p=1', Math.abs(r0.p-1)<1e-9);
var r1=A.anova([[1,2,3],[10,11,12],[20,21,22]]);
ok('separated p<0.001', r1.p<0.001);
ok('dfb=2 dfw=6', r1.dfb===2 && r1.dfw===6);
console.log('AnovaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
