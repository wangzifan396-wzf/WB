
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('predict +', A.ppPredict([1,0,0],[2,3])===1);
ok('predict -', A.ppPredict([-1,0,0],[2,3])===-1);
var w=[0,0,0]; A.ppTrain(w,[-1,-1],-1,0.1); ok('train corrects neg', A.ppPredict(w,[-1,-1])===-1);
var w2=[-3,0,0]; for(var t=0;t<30;t++) A.ppTrain(w2,[1,1],1,0.1); ok('train corrects pos', A.ppPredict(w2,[1,1])===1);
// separable data converges to 100% accuracy
var data=A.ppData(100, A._rng(99), [0.7,-0.5,0.05]); var ww=[0,0,0];
for(var e=0;e<500;e++){ for(var i=0;i<data.length;i++) A.ppTrain(ww,data[i].x,data[i].y,0.03); }
ok('converges 100%', A.ppAccuracy(ww,data)===1);
console.log('PerceptronForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
