
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sin30', Math.abs(A.trig(30).sin-0.5)<1e-9);
ok('cos0', Math.abs(A.trig(0).cos-1)<1e-9);
ok('sin90', Math.abs(A.trig(90).sin-1)<1e-9);
ok('tan45', Math.abs(A.trig(45).tan-1)<1e-6);
ok('tan90', !isFinite(A.trig(90).tan));
console.log('UnitCircleForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
