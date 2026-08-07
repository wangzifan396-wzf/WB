
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('molality(2,1)=2', Math.abs(A.molality(2,1)-2)<1e-9);
ok('molality kg<=0 NaN', isNaN(A.molality(1,0)));
// 1 mol/L NaCl (MM 58.44) in density 1.0 kg/L solution -> kg solvent = 1 - 0.05844 = 0.94156 -> 1.062
ok('molarityToMolality(1,1,58.44)~1.062', Math.abs(A.molarityToMolality(1,1,58.44)-1.062)<0.005);
console.log('MolalityForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
