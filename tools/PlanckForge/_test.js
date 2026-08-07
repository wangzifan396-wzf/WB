
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('wien(5778)~5.015e-7', Math.abs(A.wienLambdaMax(5778)-5.0152e-7)<1e-9);
ok('wienTemp(B_WIEN)=1', Math.abs(A.wienTemp(A.B_WIEN)-1)<1e-9);
ok('wien neg NaN', isNaN(A.wienLambdaMax(-5)));
console.log('PlanckForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
