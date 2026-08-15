
function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;
let pass=0,fail=0;function ok(n,c){if(c)pass++;else{fail++;console.error('  FAIL: '+n);}}
var q=A.QUIZ[0];
ok('correct',A.check(q,q.answer)===true);
ok('wrong',A.check(q,(q.answer+1)%3)===false);
ok('quiz',A.QUIZ.indexOf(A.quiz(function(){return 0;}))===0);
ok('len',A.QUIZ.length===5);
console.log('GrammarForge2 _test: '+pass+' passed, '+fail+' failed');process.exit(fail?1:0);
