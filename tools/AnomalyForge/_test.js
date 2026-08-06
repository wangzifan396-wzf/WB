
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var X=[]; for(var i=0;i<50;i++) X.push([(i%10)*0.1-0.45, Math.floor(i/10)*0.1-0.45]);
var mean=A.anMean(X), C=A.anCov(X,mean), Ci=A.anInv2(C);
var inlier=A.anMah([0,0],mean,Ci), outlier=A.anMah([5,5],mean,Ci);
ok('outlier much larger', outlier > inlier*10);
ok('inv2 identity-ish', (function(){var I=A.anInv2([[4,0],[0,4]]); return Math.abs(I[0][0]-0.25)<1e-9 && Math.abs(I[1][1]-0.25)<1e-9;})());
console.log('AnomalyForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
