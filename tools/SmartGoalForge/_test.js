
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.smartGoal({goal:'上线 v2', specific:'重构结算模块'});
  ok('smart goal', s.indexOf('# SMART 目标 · 上线 v2')>=0);
  ok('smart 5 items', s.indexOf('**S 具体**')>=0 && s.indexOf('**M 可衡量**')>=0 && s.indexOf('**A 可实现**')>=0 && s.indexOf('**R 相关**')>=0 && s.indexOf('**T 有时限**')>=0);
  ok('smart custom S', s.indexOf('- **S 具体**：重构结算模块')>=0);
  ok('smart milestone', s.indexOf('## 里程碑')>=0);
  console.log(T.join('\n'));
  console.log('SMART_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
