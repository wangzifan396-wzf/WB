
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('decode lo', Math.abs(A.gaDecode(new Array(8).fill(0),-1,1)-(-1))<1e-9);
ok('decode hi', Math.abs(A.gaDecode(new Array(8).fill(1),-1,1)-1)<1e-9);
ok('peak at 0.3', Math.abs(A.gaFitness(0.3)-1)<1e-9);
ok('lower off-peak', A.gaFitness(0.3) > A.gaFitness(0.8));
var pop=A.gaInit(40,12,A._rng(5)); var b0=A.gaBest(pop,-1,1).f;
for(var g=0;g<80;g++) pop=A.gaStep(pop,-1,1,A._rng(1000+g),3,0.03);
var b1=A.gaBest(pop,-1,1);
ok('improves', b1.f >= b0 - 1e-9);
ok('near optimum', b1.f > 0.9);
console.log('GeneticForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
