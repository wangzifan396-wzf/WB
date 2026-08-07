
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zScore(115,100,15)=1', Math.abs(A.zScore(115,100,15)-1)<1e-9);
ok('zScore(70,100,15)=-2', Math.abs(A.zScore(70,100,15)+2)<1e-9);
ok('zScore sd=0 = NaN', isNaN(A.zScore(5,5,0)));
ok('zFromList(5,[1,3,5,7,9])=0', Math.abs(A.zFromList(5,[1,3,5,7,9])-0)<1e-9);
ok('percentileFromZ(0)=0.5', Math.abs(A.percentileFromZ(0)-0.5)<1e-3);
console.log('ZScoreForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
