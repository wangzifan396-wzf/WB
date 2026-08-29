
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.spinWheel({items:'A\nB', seed:1});
  ok('wheel ok', a.ok && a.options===2);
  ok('wheel winner valid', a.winner==='A' || a.winner==='B');
  ok('wheel deterministic', A.spinWheel({items:'A\nB', seed:1}).winner===a.winner);
  ok('wheel zero weight', A.spinWheel({items:'A:100\nB:0', seed:1}).winner==='A');
  ok('wheel names stripped', A.spinWheel({items:'一等奖: 1\n二等奖: 5', seed:3}).names.join(',')==='一等奖,二等奖');
  ok('wheel empty', A.spinWheel({items:''}).ok===false);
  ok('wheel bad weight', A.spinWheel({items:'A:x\nB:1', seed:2}).options===2);
  console.log(T.join('\n'));
  console.log('WHEEL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
