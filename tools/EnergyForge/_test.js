
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('kinetic(2,3)=9', A.kinetic(2,3)===9);
ok('gpe(1,9.81,10)=98.1', Math.abs(A.gpe(1,9.81,10)-98.1)<1e-9);
ok('elasticPE(100,0.2)=2', A.elasticPE(100,0.2)===2);
ok('springForce(100,0.2)=-20', A.springForce(100,0.2)===-20);
ok('work(10,5,0)=50', A.work(10,5,0)===50);
ok('work(10,5,90)~0', Math.abs(A.work(10,5,90))<1e-9);
ok('powerP(100,2)=50', A.powerP(100,2)===50);
console.log('EnergyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
