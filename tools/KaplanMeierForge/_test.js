
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.km([1,2,3],[1,1,1]);
ok('km t1 2/3', Math.abs(r[1].S-2/3)<1e-9);
ok('km t3 0', Math.abs(r[3].S)<1e-9);
var r2=A.km([1,2,3],[1,0,1]);
ok('censored t1 2/3', Math.abs(r2[1].S-2/3)<1e-9);
ok('censored t3 0', Math.abs(r2[3].S)<1e-9);
console.log('KaplanMeierForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
