
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
ok('len',A.HIRA.length>=46);
var q=A.quiz(rngFactory(1)); ok('quiz',q.kana && q.choices.length===4 && q.choices.indexOf(q.answer)>=0);
ok('check',A.check(q,q.answer)===true && A.check(q,'zzz')===false);
console.log('HiraganaForge _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
