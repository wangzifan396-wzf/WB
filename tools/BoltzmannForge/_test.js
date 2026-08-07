
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('ratio(0,0.1,300) ~0.0209', Math.abs(A.populationRatio(0,0.1,300)-0.02094)<1e-3);
ok('factor = ratio when e1=0', Math.abs(A.factor(0.1,300)-A.populationRatio(0,0.1,300))<1e-9);
ok('equal energy ratio 1', Math.abs(A.populationRatio(0,0,300)-1)<1e-9);
console.log('BoltzmannForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
