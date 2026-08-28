
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.cornellNotes({topic:'光合作用', cues:'叶绿体\n光照'});
  ok('cornell topic', s.indexOf('# 光合作用')>=0);
  ok('cornell sections', s.indexOf('## 线索栏')>=0 && s.indexOf('## 笔记栏')>=0 && s.indexOf('## 总结')>=0);
  ok('cornell cues', s.indexOf('- 叶绿体')>=0 && s.indexOf('- 光照')>=0);
  ok('cornell placeholder', A.cornellNotes({}).indexOf('（关键词')>=0);
  console.log(T.join('\n'));
  console.log('CORNELL_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
