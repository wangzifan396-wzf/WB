
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('N2+3H2<->2NH3 Q=0.03125', Math.abs(A.kc([1,2,0.5],[-1,-3,2])-0.03125)<1e-9);
ok('symmetric 1,1 / 1,-1 ->1', Math.abs(A.kc([2,2],[1,-1])-1)<1e-9);
console.log('EquilibriumForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
