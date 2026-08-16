
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('tone',A.tone(440,1000,0.1).length===100);
ok('bin',A.binaural(200,210,1000,0.1).length===200);
ok('finite',A.binaural(200,210,1000,0.1).every(function(x){return isFinite(x)&&Math.abs(x)<=1.0001;}));
ok('bad',A.binaural(0,210,1000,0.1).length===0);
console.log('BinauralForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
