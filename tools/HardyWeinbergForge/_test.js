
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.byP(0.3);
ok('byP p=0.3 q=0.7', Math.abs(r1.p-0.3)<1e-9 && Math.abs(r1.q-0.7)<1e-9);
ok('byP AA=0.09', Math.abs(r1.AA-0.09)<1e-9);
ok('byP Aa=0.42', Math.abs(r1.Aa-0.42)<1e-9);
ok('byP aa=0.49', Math.abs(r1.aa-0.49)<1e-9);
ok('byP sums to 1', Math.abs(r1.AA+r1.Aa+r1.aa-1)<1e-9);
var r2=A.alleleFreqs(50,40,10);
ok('alleleFreqs p=0.7', Math.abs(r2.p-0.7)<1e-9 && Math.abs(r2.q-0.3)<1e-9);
console.log('HardyWeinbergForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
