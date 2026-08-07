
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var xs=[-1,-1,-1,-1,5,5,5,5];
var r=A.gmm1d(xs,100);
var match=(Math.abs(r.m1+1)<0.3 && Math.abs(r.m2-5)<0.3) || (Math.abs(r.m1-5)<0.3 && Math.abs(r.m2+1)<0.3);
ok('means near -1 and 5', match);
ok('weights sum ~1', Math.abs(r.w1+r.w2-1)<1e-9);
console.log('GaussianMixtureForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
