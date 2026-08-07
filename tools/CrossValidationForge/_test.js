
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.kFoldAccuracy([1,0,1,0,1,0],[1,0,1,0,1,0],3);
ok('perfect mean 1', Math.abs(r.mean-1)<1e-9);
var r2=A.kFoldAccuracy([1,0,1,0,1,0],[0,1,0,1,0,1],3);
ok('all wrong mean 0', r2.mean===0);
ok('null invalid k', A.kFoldAccuracy([1,2,3], [1,2,3], 5)===null);
console.log('CrossValidationForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
