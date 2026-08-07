
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('Q=1 -> E=E0', Math.abs(A.nernst(1.10,2,1)-1.10)<1e-9);
ok('Q=10 @298.15 ~1.0704', Math.abs(A.nernst(1.10,2,10,298.15)-1.0704)<1e-3);
console.log('NernstForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
