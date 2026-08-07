
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('addDb([60,60])=63.01', Math.abs(A.addDb([60,60])-63.0103)<1e-2);
ok('dbPower(10)=10', A.dbPower(10)===10);
ok('dbAmp(10)=20', A.dbAmp(10)===20);
ok('ratioFromDbPower(10)=10', Math.abs(A.ratioFromDbPower(10)-10)<1e-9);
ok('ratioFromDbAmp(20)=10', Math.abs(A.ratioFromDbAmp(20)-10)<1e-9);
ok('splFromPa(20e-6)=0', Math.abs(A.splFromPa(20e-6))<1e-9);
ok('splFromPa(0.1)=73.98', Math.abs(A.splFromPa(0.1)-73.9794)<1e-2);
console.log('DecibelForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
