
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('carnot 500/300 =0.4', Math.abs(A.carnotEfficiency(500,300)-0.4)<1e-9);
ok('carnot work 1000 ->400', Math.abs(A.carnotWork(1000,500,300)-400)<1e-9);
ok('carnot invalid Th', isNaN(A.carnotEfficiency(0,300)));
console.log('HeatEngineForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
