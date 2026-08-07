
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('R constant', A.R===8.314462618);
ok('boyle(100,2,200)=1', Math.abs(A.boyle(100,2,200)-1)<1e-9);
ok('charles(1,300,600)=2', Math.abs(A.charles(1,300,600)-2)<1e-9);
ok('gayLussac(1,300,600)=2', Math.abs(A.gayLussac(1,300,600)-2)<1e-9);
ok('idealP(2,300,0.05)~99773.6', Math.abs(A.idealP(2,300,0.05)-99773.55)<1e-1);
ok('idealV(99773.55,2,300)~0.05', Math.abs(A.idealV(99773.55,2,300)-0.05)<1e-4);
ok('idealN(99773.55,0.05,300)~2', Math.abs(A.idealN(99773.55,0.05,300)-2)<1e-3);
ok('idealT(99773.55,0.05,2)~300', Math.abs(A.idealT(99773.55,0.05,2)-300)<1e-3);
console.log('GasLawsForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
