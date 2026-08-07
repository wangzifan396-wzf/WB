
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('weightedGrade 50/80 + 50/90 =85', Math.abs(A.weightedGrade([{weight:50,score:80},{weight:50,score:90}])-85)<1e-9);
ok('neededScore 40/80/60/85=92.5', Math.abs(A.neededScore(40,80,60,85)-92.5)<1e-9);
ok('neededScore w=0 NaN', isNaN(A.neededScore(0,80,60,85)));
console.log('GradeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
