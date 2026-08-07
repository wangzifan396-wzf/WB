
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('equivalenceVol(0.1,50,0.1)=50', Math.abs(A.equivalenceVol(0.1,50,0.1)-50)<1e-9);
ok('phAt start 0.1M acid=1', Math.abs(A.phAt(0.1,50,0.1,0)-1)<1e-9);
ok('phAt equivalence=7', Math.abs(A.phAt(0.1,50,0.1,50)-7)<1e-9);
ok('phAt 1.5Ve ~12.30', Math.abs(A.phAt(0.1,50,0.1,75)-12.301)<1e-2);
var c=A.curve(0.1,50,0.1,10); ok('curve length 11', c.length===11 && Math.abs(c[5].Vb-30)<1e-9);
console.log('TitrationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
