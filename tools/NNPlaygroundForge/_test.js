
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sigmoid 0', Math.abs(A.nnSigmoid(0)-0.5)<1e-9);
ok('sigmoid large', A.nnSigmoid(20)>0.99 && A.nnSigmoid(-20)<0.01);
var net=A.nnInit(4,A._rng(1));
var X=[[0,0],[0,1],[1,0],[1,1]], Y=[0,1,1,0];
var l0=0; for(var k=0;k<4;k++){ var f=A.nnForward(net,X[k]); l0+=(f.out-Y[k])*(f.out-Y[k]); }
for(var t=0;t<6000;t++){ var k=t%4; A.nnTrainStep(net,X[k],Y[k],0.5); }
var l1=0, cor=0; for(var k=0;k<4;k++){ var f=A.nnForward(net,X[k]); l1+=(f.out-Y[k])*(f.out-Y[k]); if((f.out>=0.5?1:0)===Y[k]) cor++; }
ok('xor loss decreases', l1 < l0*0.4);
ok('xor learns >=3', cor>=3);
console.log('NNPlaygroundForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
