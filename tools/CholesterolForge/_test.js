
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('total', A.cholesterolEval(100,50,150).total===180);
ok('ldl', A.cholesterolEval(90,50,150).ldlLevel==='理想');
ok('ldlNear', A.cholesterolEval(100,50,150).ldlLevel==='接近理想');
ok('riskHigh', A.cholesterolEval(200,40,150).risk==='高风险');
ok('riskLow', A.cholesterolEval(90,60,100).risk==='低风险');
ok('err', !!A.cholesterolEval(-1,50,150).error);
console.log('CholesterolForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
