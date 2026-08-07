
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.linreg([1,2,3,4],[2,4,6,8]);
ok('slope 2', Math.abs(r.slope-2)<1e-9);
ok('intercept 0', Math.abs(r.intercept)<1e-9);
ok('r2 1', Math.abs(r.r2-1)<1e-9);
ok('predict 5 ->10', Math.abs(r.predict(5)-10)<1e-9);
var r2=A.linreg([0,1,2],[1,3,5]);
ok('slope ~2', Math.abs(r2.slope-2)<1e-9);
ok('intercept ~1', Math.abs(r2.intercept-1)<1e-9);
console.log('LinearRegressionForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
