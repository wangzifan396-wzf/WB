
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.countFreq('a b a c');
  ok('count total', a.total===4);
  ok('count unique', a.unique===3);
  ok('count top1', a.items[0].key==='a' && a.items[0].count===2);
  var b=A.countFreq('x\ny\nx',{mode:'line'});
  ok('count line mode', b.unique===2 && b.total===3);
  ok('count top clamp', A.countFreq('a b c',{top:2}).items.length===2);
  ok('count empty', A.countFreq('').total===0);
  ok('count cjk', A.countFreq('你好 你好 世界').unique===2);
  console.log(T.join('\n'));
  console.log('COUNT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
