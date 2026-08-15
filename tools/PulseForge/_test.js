
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('mhr',A.mhr(30)===190);
ok('thr',Math.abs(A.thr(30,70,0.7)-154)<1e-9);
var z=A.zones(30,70);
ok('light',Math.abs(z.light-130)<1e-9);
ok('mod',Math.abs(z.moderate-142)<1e-9);
ok('peak',Math.abs(z.peak-172)<1e-9);
ok('err',A.thr(30,70,1.5)===null);
console.log('PulseForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
