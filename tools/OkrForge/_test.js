
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.okrNotes({objective:'提升留存', keyResults:'首周留存 30%→45%\n次日留存 50%→65%'});
  ok('okr objective', s.indexOf('# Objective：提升留存')>=0);
  ok('okr kr1', s.indexOf('KR1：首周留存 30%→45%')>=0);
  ok('okr kr2', s.indexOf('KR2：次日留存 50%→65%')>=0);
  ok('okr sections', s.indexOf('## 关键举措')>=0 && s.indexOf('## 风险与依赖')>=0);
  ok('okr placeholder', A.okrNotes({}).indexOf('KR1：____')>=0);
  console.log(T.join('\n'));
  console.log('OKR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
