
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var X=[]; for(var i=-10;i<=10;i++) X.push([i,i]); // perfectly along [1,1]
var Xc=A.pcaCenter(X), C=A.pcaCov(Xc), e=A.pcaEig2(C);
var dot=(e.v[0]*1+e.v[1]*1)/Math.sqrt(2);
ok('pc aligned with [1,1]', Math.abs(Math.abs(dot)-1)<1e-6);
ok('lambda1 >= lambda2', e.l1>=e.l2-1e-9);
var proj=A.pcaProject(Xc,e.v);
var mean=proj.reduce(function(a,b){return a+b;},0)/proj.length;
ok('projection zero-mean', Math.abs(mean)<1e-9);
console.log('PcaForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
