
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('eag', A.hba1cEval(7).eagMg===154);
ok('mmol', A.hba1cEval(7).eagMmol===8.5);
ok('status', A.hba1cEval(7).status==='糖尿病');
ok('pred', A.hba1cEval(6).status==='糖尿病前期');
ok('err', !!A.hba1cEval(0).error);
console.log('Hba1cForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
