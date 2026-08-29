
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.percentChange(100,150);
  ok('pct up', a.ok && a.percent===50 && a.direction==='up');
  var b=A.percentChange(200,100);
  ok('pct down', b.percent===-50 && b.direction==='down');
  ok('pct flat', A.percentChange(100,100).direction==='flat');
  ok('pct zero base', A.percentChange(0,10).ok===false);
  ok('pct bad', A.percentChange('x',1).ok===false);
  ok('partOf', A.partOf(25,100).percent===25);
  ok('partOf zero', A.partOf(1,0).ok===false);
  console.log(T.join('\n'));
  console.log('PCT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
