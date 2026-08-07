
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rate 2*[A]^1', Math.abs(A.rateLaw(2,[3],[1])-6)<1e-9);
ok('arrhenius positive', A.arrhenius(1e13,50000,300)>0);
ok('hl k=0.1 ~6.931', Math.abs(A.halfLifeFirst(0.1)-6.93147)<1e-3);
ok('decay at t=0 =N0', Math.abs(A.decay(100,0.1,0)-100)<1e-9);
console.log('ReactionRateForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
