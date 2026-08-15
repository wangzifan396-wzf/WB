
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('zero',Math.abs(A.emi(1200,0,12)-100)<1e-9);
ok('pos',A.emi(100000,5,12)>0);
var s=A.schedule(100000,5,12);
ok('len',s.length===12);
ok('bal0',s[11].balance===0);
ok('pay',Math.abs(s[0].payment-A.emi(100000,5,12))<1e-9);
console.log('EmiForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
