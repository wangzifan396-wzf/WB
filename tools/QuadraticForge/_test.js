
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r1=A.solve(1,-3,2);
ok('solve 1,-3,2 real', r1.type==='real' && Math.abs(r1.roots[0]-2)<1e-9 && Math.abs(r1.roots[1]-1)<1e-9);
var r2=A.solve(1,0,1);
ok('solve 1,0,1 complex', r2.type==='complex' && Math.abs(r2.roots[0].re)<1e-9 && Math.abs(r2.roots[0].im-1)<1e-9);
var r3=A.solve(1,-2,1);
ok('solve 1,-2,1 double root', r3.type==='real' && Math.abs(r3.roots[0]-1)<1e-9 && Math.abs(r3.roots[1]-1)<1e-9);
ok('solve a=0 error', !!A.solve(0,1,1).error);
ok('D of 1,-3,2 = 1', Math.abs(A.solve(1,-3,2).D-1)<1e-9);
console.log('QuadraticForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
