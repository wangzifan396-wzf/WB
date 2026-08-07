
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('simpson x^2 [0,1] ~1/3', Math.abs(A.simpson(function(x){return x*x;},0,1,100)-1/3)<1e-6);
ok('trapezoid x [0,1] =0.5', Math.abs(A.trapezoid(function(x){return x;},0,1,100)-0.5)<1e-6);
ok('simpson 1 [0,2] =2', Math.abs(A.simpson(function(x){return 1;},0,2,10)-2)<1e-9);
console.log('IntegralForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
