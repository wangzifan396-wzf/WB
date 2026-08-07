
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('wavelength(3e8,100e6)=3', Math.abs(A.wavelength(3e8,100e6)-3)<1e-9);
ok('photonEnergyHz(1e15)~6.626e-19', Math.abs(A.photonEnergyHz(1e15)-6.62607015e-19)<1e-25);
ok('frequency(3e8,3)=100e6', Math.abs(A.frequency(3e8,3)-100e6)<1e-3);
ok('photonEnergyLambda(5e-7)~3.97e-19', Math.abs(A.photonEnergyLambda(5e-7)-3.9728e-19)<1e-22);
console.log('WavelengthForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
