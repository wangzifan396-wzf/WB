
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.timebox('A\nB', 60);
  ok('timebox equal', a.ok && a.items[0].minutes===30 && a.items[1].minutes===30);
  var b=A.timebox('A:3\nB:1', 100);
  ok('timebox weighted', b.items[0].minutes===75 && b.items[1].minutes===25);
  ok('timebox count', b.count===2);
  ok('timebox bad total', A.timebox('A', 0).ok===false);
  ok('timebox no tasks', A.timebox('', 60).ok===false);
  var c=A.timebox('A\nB\nC', 100, {round:true});
  ok('timebox round ints', c.items.every(function(x){ return x.minutes===Math.round(x.minutes); }));
  var d=A.timebox('A:1\nB:1', 100, {minSlot:60});
  ok('timebox minSlot', d.items[0].minutes===60);
  console.log(T.join('\n'));
  console.log('TIMEBOX_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
