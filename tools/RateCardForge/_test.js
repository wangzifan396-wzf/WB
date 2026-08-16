
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('base', A.quote('short',1,[]).total===800);
ok('multi', A.quote('short',2,[]).total===1600);
ok('ad', A.quote('short',2,['voiceover']).total===2400);
ok('multiadd', A.quote('long',1,['script','motion']).total===3000+500+1200);
ok('err', !!A.quote('x',1,[]).error);
console.log('RateCardForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
