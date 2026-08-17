
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var f=A.coinFlip(rngFactory(3)); ok('valid', f==='正面'||f==='反面');
ok('many', (function(){ for(var i=0;i<200;i++){ var x=A.coinFlip(rngFactory(i+1)); if(x!=='正面'&&x!=='反面') return false; } return true; })());
ok('rng', typeof A.coinFlip(rngFactory(9))==='string');
console.log('CoinFlipForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
