
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('powInt(2,10)=1024', A.powInt(2n,10n)===1024n);
ok('powInt(3,0)=1', A.powInt(3n,0n)===1n);
ok('powInt(2,-3)=1/8', A.powInt(2n,-3n)===0.125);
ok('powReal(2,0.5)~1.4142', Math.abs(A.powReal(2,0.5)-Math.SQRT2)<1e-12);
ok('powReal(0,-1)=NaN', isNaN(A.powReal(0,-1)));
console.log('ExponentForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
