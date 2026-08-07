
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var k1=A.rateConstant(1e13,50000,300), k2=A.rateConstant(1e13,50000,310);
ok('rateConstant finite', isFinite(k1) && k1>0);
ok('activationEnergy recovers Ea', Math.abs(A.activationEnergy(k1,300,k2,310)-50000)<1);
ok('rateConstant T<=0 NaN', isNaN(A.rateConstant(1e13,50000,0)));
console.log('ActivationEnergyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
