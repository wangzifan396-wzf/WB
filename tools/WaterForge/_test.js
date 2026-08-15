
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('low',A.target(60,'low')===2100);
ok('high',A.target(70,'high')===Math.round(70*35+500));
ok('bad',A.target(-1,'low')===null);
ok('g',A.glasses(2100)===9);
console.log('WaterForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
