
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('Cmaj',JSON.stringify(A.chordNotes('C','maj'))===JSON.stringify(['C','E','G']));
ok('Amin',JSON.stringify(A.chordNotes('A','min'))===JSON.stringify(['A','C','E']));
ok('Cmaj7',JSON.stringify(A.chordNotes('C','maj7'))===JSON.stringify(['C','E','G','B']));
ok('bad',A.chordNotes('H','maj')===null);
console.log('ChordFinderForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
