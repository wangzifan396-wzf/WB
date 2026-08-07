
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gamma(0)=1', A.gamma(0)===1);
ok('timeDilation(0,10)=10', A.timeDilation(0,10)===10);
ok('lengthContract(0,5)=5', A.lengthContract(0,5)===5);
ok('massEnergy(1)~8.9876e16', Math.abs(A.massEnergy(1)-8.9876e16)<1e12);
ok('gamma(0.6c)~1.25', Math.abs(A.gamma(0.6*A.C)-1.25)<1e-9);
ok('timeDilation(0.6c,1)~1.25', Math.abs(A.timeDilation(0.6*A.C,1)-1.25)<1e-9);
console.log('RelativisticForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
