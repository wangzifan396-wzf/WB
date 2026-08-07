
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('cToF(0)=32', A.cToF(0)===32);
ok('cToF(100)=212', A.cToF(100)===212);
ok('fToC(32)=0', Math.abs(A.fToC(32))<1e-9);
ok('cToK(0)=273.15', Math.abs(A.cToK(0)-273.15)<1e-9);
ok('kToC(273.15)=0', Math.abs(A.kToC(273.15))<1e-9);
ok('fToK(32)=273.15', Math.abs(A.fToK(32)-273.15)<1e-9);
ok('kToF(273.15)=32', Math.abs(A.kToF(273.15)-32)<1e-9);
ok('heatQ(1,4186,10)=41860', A.heatQ(1,4186,10)===41860);
ok('latentQ(1,2.26e6)=2.26e6', A.latentQ(1,2.26e6)===2.26e6);
ok('SPEC.water=4186', A.SPEC.water===4186);
console.log('ThermoForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
