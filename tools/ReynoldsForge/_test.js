
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('rho', Math.abs(A.reynoldsRho(1000,1,0.1,0.001)-100000)<1e-6);
ok('nu', Math.abs(A.reynoldsNu(1,0.1,1e-6)-100000)<1e-6);
ok('laminar', A.regime(100)==='层流');
ok('trans', A.regime(3000)==='过渡流');
ok('turb', A.regime(5000)==='湍流');
ok('err', !!A.reynoldsRho(1000,1,0.1,0).error);
console.log('ReynoldsForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
