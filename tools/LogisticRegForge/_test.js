
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var X=[[0],[1],[0],[1]], y=[0,1,0,1];
var w=A.train(X,y,0.1,3000);
ok('classify 1 ->1', A.predict(w,[1])===1);
ok('classify 0 ->0', A.predict(w,[0])===0);
ok('sigmoid 0 =0.5', Math.abs(A.sigmoid(0)-0.5)<1e-9);
console.log('LogisticRegForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
