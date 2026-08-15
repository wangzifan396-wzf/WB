
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('apy',Math.abs(A.apy(0.12,12)-(Math.pow(1.01,12)-1))<1e-12);
ok('nom',Math.abs(A.nominalFromApy(A.apy(0.12,12),12)-0.12)<1e-9);
ok('zero',Math.abs(A.apy(0,1)-0)<1e-12);
ok('ear',Math.abs(A.ear(0.06,4)-(Math.pow(1.015,4)-1))<1e-12);
ok('err',A.apy(-1,12)===null);
console.log('AprForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
