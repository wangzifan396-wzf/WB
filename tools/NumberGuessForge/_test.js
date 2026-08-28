
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('guess hit', A.guessCheck(50,50).result==='hit');
  ok('guess low', A.guessCheck(50,30).result==='low');
  ok('guess high', A.guessCheck(50,70).result==='high');
  ok('guess invalid', A.guessCheck(50,0).result==='invalid');
  ok('guess hint mid', A.guessHint(1,100)===50);
  console.log(T.join('\n'));
  console.log('GUESS_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
