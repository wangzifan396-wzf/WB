
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var src='中国首都: 北京\n水的化学式: H2O\n光速约: 30 万公里每秒';
  var b=A.quizGen(src, {mode:'blank', seed:1});
  ok('quiz count', b.ok && b.count===3);
  ok('quiz q1', b.text.indexOf('Q1. 中国首都')>=0);
  ok('quiz answer', b.text.indexOf('答案：北京')>=0);
  var c=A.quizGen(src, {mode:'choice', seed:1});
  ok('quiz choice has options', c.text.indexOf('A)')>=0);
  var m=c.text.match(/答案：([A-F])/);
  ok('quiz choice answer letter', !!m && m[1].length===1);
  ok('quiz deterministic', A.quizGen(src,{mode:'choice',seed:7}).text===A.quizGen(src,{mode:'choice',seed:7}).text);
  ok('quiz empty', A.quizGen('').ok===false);
  ok('quiz bad lines', A.quizGen('no colon here').ok===false);
  console.log(T.join('\n'));
  console.log('QUIZ_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
