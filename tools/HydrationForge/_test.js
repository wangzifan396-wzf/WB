
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('base',Math.abs(A.estimate(70,0,'normal')-2.31)<1e-9);
ok('act',Math.abs(A.estimate(70,60,'normal')-2.61)<1e-9);
ok('hot',Math.abs(A.estimate(70,0,'hot')-2.81)<1e-9);
ok('bad',A.estimate(0,0,'normal')===null);
console.log('HydrationForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
