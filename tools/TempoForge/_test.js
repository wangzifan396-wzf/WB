
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('q120', Math.abs(A.quarterMs(120)-500)<1e-9);
ok('note', Math.abs(A.noteMs(120,2)-1000)<1e-9);
ok('back', Math.abs(A.bpmFromQuarterMs(500)-120)<1e-9);
ok('name', A.noteName(4)==='全音符');
ok('err', !!A.quarterMs(0).error);
console.log('TempoForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
