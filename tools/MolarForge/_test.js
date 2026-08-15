
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('gL',Math.abs(A.molarToGPerL(2,58.44)-116.88)<1e-6);
ok('mol',Math.abs(A.gPerLToMolar(116.88,58.44)-2)<1e-9);
ok('round',Math.abs(A.massPctToMolar(10,58.44,1.07)-1.8313)<1e-3);
ok('pct',Math.abs(A.molarToMassPct(1.8313,58.44,1.07)-10)<1e-2);
ok('err',A.massPctToMolar(110,58.44,1.07)===null);
console.log('MolarForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
