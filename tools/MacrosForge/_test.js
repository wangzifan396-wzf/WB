
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('computeMacros 2000/30/40/30', (function(){var r=A.computeMacros(2000,30,40,30); return Math.abs(r.proteinG-150)<1e-9 && Math.abs(r.carbG-200)<1e-9 && Math.abs(r.fatG-66.6667)<1e-3;})());
ok('proteinRange(70) 112-154', (function(){var r=A.proteinRange(70); return Math.abs(r.min-112)<1e-9 && Math.abs(r.max-154)<1e-9;})());
ok('macrosFromWeight cut 70 -> 140g', Math.abs(A.macrosFromWeight(70,'cut').proteinG-140)<1e-9);
ok('KCAL.protein=4', A.KCAL.protein===4);
console.log('MacrosForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
