
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.speedCalc({distance:100,time:2});
  ok('speed solve v', a.ok && a.speed===50 && a.solved==='speed');
  var b=A.speedCalc({speed:50,time:2});
  ok('speed solve d', b.distance===100 && b.solved==='distance');
  var c=A.speedCalc({distance:100,speed:50});
  ok('speed solve t', c.time===2 && c.solved==='time');
  ok('speed one only', A.speedCalc({distance:100}).ok===false);
  ok('speed all three', A.speedCalc({distance:1,time:1,speed:1}).ok===false);
  ok('speed bad time', A.speedCalc({distance:100,time:0}).ok===false);
  ok('speed zero v for t', A.speedCalc({distance:100,speed:0}).ok===false);
  console.log(T.join('\n'));
  console.log('SPEED_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
