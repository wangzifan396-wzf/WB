
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sin30=0.5', Math.abs(A.sin(30,true)-0.5)<1e-9);
ok('cos60=0.5', Math.abs(A.cos(60,true)-0.5)<1e-9);
ok('tan45=1', Math.abs(A.tan(45,true)-1)<1e-9);
ok('asin0.5=30', Math.abs(A.asin(0.5,true)-30)<1e-9);
ok('acos0.5=60', Math.abs(A.acos(0.5,true)-60)<1e-9);
ok('atan1=45', Math.abs(A.atan(1,true)-45)<1e-9);
ok('toRad(180)=PI', Math.abs(A.toRad(180)-Math.PI)<1e-9);
ok('sin(pi/2 rad)=1', Math.abs(A.sin(Math.PI/2,false)-1)<1e-9);
console.log('TrigForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
