
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var train=[]; for(var i=0;i<8;i++) train.push({x:[0.1*i,0.1*i],y:0}); for(var i=0;i<8;i++) train.push({x:[1+0.1*i,1+0.1*i],y:1});
ok('knn near A', A.knnPredict(train,[0.2,0.2],3)===0);
ok('knn near B', A.knnPredict(train,[1.2,1.2],3)===1);
ok('knn dist 3-4', Math.abs(A.knnDist([0,0],[3,4])-5)<1e-9);
console.log('KnnForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
