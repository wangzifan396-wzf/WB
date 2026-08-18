
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var b=A.makeBoard(6, rngFactory(5));
ok('len', b.length===12);
ok('pairs', (function(){ var c={}; b.forEach(function(x){c[x]=(c[x]||0)+1;}); return Object.keys(c).every(function(k){return c[k]===2;}); })());
ok('match', A.checkMatch('a','a')===true && A.checkMatch('a','b')===false);
ok('clamp', A.makeBoard(99).length===36);
console.log('MemoryGameForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
