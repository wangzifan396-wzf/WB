
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.mergeLines('a\nb','1\n2');
  ok('merge basic', a.text==='a\t1\nb\t2');
  ok('merge rows', a.rows===2);
  var b=A.mergeLines('a','1\n2');
  ok('merge uneven', b.rows===2 && b.text==='a\t1\n\t2');
  ok('merge custom sep', A.mergeLines('a','1',{sep:','}).text==='a,1');
  ok('merge empty', A.mergeLines('','').rows===1);
  console.log(T.join('\n'));
  console.log('MERGE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
