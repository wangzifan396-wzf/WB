
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var r=A.concrete(2,2,0.1,10);
ok('vol', Math.abs(r.volume-0.4)<1e-9);
ok('bags', r.bags===22);
ok('weight', r.weightKg===880);
ok('err', !!A.concrete(0,2,0.1).error);
console.log('ConcreteForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
