
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mosteller', Math.abs(A.mosteller(70,170)-1.818)<0.02);
ok('dubois', Math.abs(A.dubois(70,170)-1.809)<0.02);
ok('haycock', Math.abs(A.haycock(70,170)-1.825)<0.03);
ok('dispatch', Math.abs(A.bsa(70,170,'mosteller')-1.818)<0.02);
console.log('BsaForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
