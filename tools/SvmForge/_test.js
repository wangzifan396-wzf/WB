
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var X=[],y=[]; for(var i=0;i<20;i++){ var x0=(i<10)?-0.8:0.8; var x1=(i%5)*0.1-0.2; X.push([x0,x1]); y.push(x0<0?-1:1); }
function _rng(seed){var s=seed>>>0||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
var m2=A.svmTrain(X,y,0.01,0.01,3000,A._rng(3));
ok('svm neg', A.svmPredict(m2.w,m2.b,[-0.5,0])===-1);
ok('svm pos', A.svmPredict(m2.w,m2.b,[0.5,0])===1);
ok('svm correctly classifies all', (function(){ for(var i=0;i<X.length;i++) if(A.svmPredict(m2.w,m2.b,X[i])!==y[i]) return false; return true; })());
console.log('SvmForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
