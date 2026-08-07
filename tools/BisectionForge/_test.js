
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('x^2-2 root sqrt2', Math.abs(A.bisection([1,0,-2],0,2,1e-9)-1.41421356)<1e-6);
ok('x^3-x root 1', Math.abs(A.bisection([1,0,-1,0],0.5,2,1e-9)-1)<1e-6);
ok('same-sign ->NaN', isNaN(A.bisection([1,0,-2],-1,0,1e-9)));
console.log('BisectionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
