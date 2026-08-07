
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var s=[1,2,1,2,1,2,1,2];
var r=A.decompose(s,2);
var okInterior=true; for(var i=2;i<=6;i++) if(Math.abs(r.resid[i])>1e-9) okInterior=false;
ok('interior resid ~0', okInterior);
ok('seasonal phase0 ~ -0.5', Math.abs(r.seasonal[0]+0.5)<1e-9);
ok('seasonal phase1 ~ 0.5', Math.abs(r.seasonal[1]-0.5)<1e-9);
console.log('SeasonalDecomposeForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
