
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('polyDeriv([1,0,0,0])=[3,0,0]', JSON.stringify(A.polyDeriv([1,0,0,0]))==='[3,0,0]');
ok('polyEval deriv x^3 at 2 =12', Math.abs(A.polyEval(A.polyDeriv([1,0,0,0]),2)-12)<1e-9);
ok('polyEval([2,3],1)=5', A.polyEval([2,3],1)===5);
ok('numDeriv x^2 at 3 ~6', Math.abs(A.numDeriv(function(x){return x*x;},3)-6)<1e-6);
console.log('DerivativeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
