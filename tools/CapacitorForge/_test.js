
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('C vacuum 1/0.001 =8.854e-9', Math.abs(A.capacitance(8.854187817e-12,1,0.001)-8.854187817e-9)<1e-15);
ok('energy 1e-6 @10 =5e-5', Math.abs(A.energy(1e-6,10)-5e-5)<1e-12);
ok('reactance 1e-6 @50 ~3183', Math.abs(A.reactance(1e-6,50)-3183.09886)<1e-2);
console.log('CapacitorForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
