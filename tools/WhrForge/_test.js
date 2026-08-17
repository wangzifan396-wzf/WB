
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('ratio', A.whr(90,100,'female').ratio===0.9);
ok('mok', A.whr(85,100,'male').level==='正常');
ok('mhigh', A.whr(95,100,'male').level.indexOf('偏高')>=0);
ok('fhigh', A.whr(90,100,'female').level.indexOf('偏高')>=0);
ok('err', !!A.whr(0,100).error);
console.log('WhrForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
