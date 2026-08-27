
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('rps rock>scissors', A.rps('rock','scissors')==='p1');
  ok('rps paper>rock', A.rps('paper','rock')==='p1');
  ok('rps scissors>paper', A.rps('scissors','paper')==='p1');
  ok('rps draw', A.rps('rock','rock')==='draw');
  ok('rps p2', A.rps('rock','paper')==='p2');
  console.log(T.join('\n'));
  console.log('RPS_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
