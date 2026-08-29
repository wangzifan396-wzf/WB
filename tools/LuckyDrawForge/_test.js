
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.luckyDraw('a,b,c,d',{pick:2,seed:1});
  ok('lucky drawn', a.drawn===2);
  ok('lucky no dup', a.winners[0]!==a.winners[1]);
  ok('lucky remaining', a.remaining.length===2);
  ok('lucky deterministic', JSON.stringify(A.luckyDraw('a,b,c,d',{pick:2,seed:1}).winners)===JSON.stringify(a.winners));
  ok('lucky clamp', A.luckyDraw('a,b',{pick:9,seed:1}).drawn===2);
  ok('lucky empty', A.luckyDraw('',{pick:1}).drawn===0);
  var all=A.luckyDraw('a,b,c',{pick:3,seed:5});
  ok('lucky all', all.drawn===3 && all.remaining.length===0);
  console.log(T.join('\n'));
  console.log('LUCKY_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
