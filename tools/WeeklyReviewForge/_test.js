
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.weeklyReview({week:'2026-W35', done:'上线 v2\n修复登录', next:'灰度 20%'});
  ok('week title', s.indexOf('# 周报复盘 · 2026-W35')>=0);
  ok('week done', s.indexOf('- [x] 上线 v2')>=0 && s.indexOf('- [x] 修复登录')>=0);
  ok('week next', s.indexOf('- [ ] 灰度 20%')>=0);
  ok('week sections', s.indexOf('## 数据 / 进展')>=0 && s.indexOf('## 做得好 / 待改进')>=0 && s.indexOf('## 风险与求助')>=0);
  ok('week placeholder', A.weeklyReview({}).indexOf('- [x] ____')>=0);
  console.log(T.join('\n'));
  console.log('WEEK_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
