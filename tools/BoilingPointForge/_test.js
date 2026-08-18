
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('sea', A.boilAltitude(0).c===100);
ok('high', (function(){var r=A.boilAltitude(2000); return r.c<100 && r.c>90;})());
ok('pressure', (function(){var r=A.boilPressure(101.325); return r.c>95 && r.c<105;})());
ok('err', !!A.boilAltitude(-5).error);
console.log('BoilingPointForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
