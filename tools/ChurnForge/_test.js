
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('churn', Math.abs(A.churnRate(1000,50)-0.05)<1e-9);
ok('ret', Math.abs(A.retentionRate(1000,50)-0.95)<1e-9);
ok('ann', Math.abs(A.annualize(0.05)-(1-Math.pow(0.95,12)))<1e-9);
ok('zero', isNaN(A.churnRate(0,5)));
console.log('ChurnForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
