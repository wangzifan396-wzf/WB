
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('nCr(10,3)=120', A.nCr(10,3)===120n);
ok('nCr(5,2)=10', A.nCr(5,2)===10n);
ok('nCr(20,10)=184756', A.nCr(20,10)===184756n);
ok('nCr(10,0)=1', A.nCr(10,0)===1n);
ok('nCr(5,6)=null', A.nCr(5,6)===null);
console.log('CombinationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
