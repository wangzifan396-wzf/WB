
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('correct', A.guessFeedback(50,50).result==='correct');
ok('low', A.guessFeedback(50,30).result==='low');
ok('high', A.guessFeedback(50,70).result==='high');
var v=A.randomSecret(1,100,rngFactory(7)).value; ok('range', v>=1 && v<=100);
ok('err', !!A.guessFeedback(50,'x').error);
console.log('GuessForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
