
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('err', !!A.irr(100,'').error);
var r3=A.irr(1000,'0 1500');
ok('simple', Math.abs(r3.irr-0.2247)<0.01);
var r=A.irr(1000,'400 400 400');
ok('pos', r.irr>0.05 && r.irr<0.15);
console.log('IrrForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
