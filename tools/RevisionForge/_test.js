
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.revisionNotes({subject:'数学', items:'二次函数最值\n概率错排'});
  ok('rev title', s.indexOf('# 错题本 · 数学')>=0);
  ok('rev item1', s.indexOf('## 1. 二次函数最值')>=0);
  ok('rev item2', s.indexOf('## 2. 概率错排')>=0);
  ok('rev fields', s.indexOf('- 错因：')>=0 && s.indexOf('- 正确思路：')>=0);
  ok('rev schedule', s.indexOf('☐ 1 天')>=0 && s.indexOf('☐ 15 天')>=0);
  ok('rev placeholder', A.revisionNotes({}).indexOf('## 1. ____')>=0);
  console.log(T.join('\n'));
  console.log('REV_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
