
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('round half-up 1.005', A.roundTo(1.005,{digits:2,mode:'half-up'}).value===1.01);
  ok('round half-even 2.5', A.roundTo(2.5,{digits:0,mode:'half-even'}).value===2);
  ok('round half-even 3.5', A.roundTo(3.5,{digits:0,mode:'half-even'}).value===4);
  ok('round floor', A.roundTo(1.239,{digits:2,mode:'floor'}).value===1.23);
  ok('round ceil', A.roundTo(1.231,{digits:2,mode:'ceil'}).value===1.24);
  ok('round trunc neg', A.roundTo(-1.9,{digits:0,mode:'trunc'}).value===-1);
  ok('round half-up neg', A.roundTo(-1.5,{digits:0,mode:'half-up'}).value===-2);
  ok('round bad', A.roundTo('abc',{}).ok===false);
  console.log(T.join('\n'));
  console.log('ROUND_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
