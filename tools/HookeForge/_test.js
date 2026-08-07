
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('force(100,0.2)=20', A.force(100,0.2)===20);
ok('force(50,0.1)=5', A.force(50,0.1)===5);
ok('energy(100,0.2)=2', A.energy(100,0.2)===2);
ok('energy(200,0.5)=25', A.energy(200,0.5)===25);
ok('xFromF(100,20)=0.2', A.xFromF(100,20)===0.2);
ok('kFromF(20,0.2)=100', A.kFromF(20,0.2)===100);
console.log('HookeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
