
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/); const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}}; fn(mod,mod.exports,require); const A=mod.exports;
let pass=0,fail=0; function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('medical test ~0.1538', Math.abs(A.bayesBinary(0.9,0.05,0.01)-0.153846)<1e-4);
ok('bayes direct ~0.1538', Math.abs(A.bayes(0.9,0.01,0.0585)-0.153846)<1e-4);
ok('certain prior ->1', A.bayesBinary(1,0,1)===1);
console.log('BayesForge _test: '+pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
