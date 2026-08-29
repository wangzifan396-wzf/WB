
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.checklist({title:'上线检查清单', groups:'准备: 备份数据、通知相关方\n执行: 灰度 10%、观察指标'});
  ok('check title', s.indexOf('# 上线检查清单')>=0);
  ok('check group1', s.indexOf('## 准备')>=0);
  ok('check group2', s.indexOf('## 执行')>=0);
  ok('check items', s.indexOf('- [ ] 备份数据')>=0 && s.indexOf('- [ ] 通知相关方')>=0);
  ok('check defaults', A.checklist({}).indexOf('## 准备')>=0 && A.checklist({}).indexOf('## 收尾')>=0);
  ok('check placeholder', A.checklist({groups:'仅分组名'}).indexOf('- [ ] ____')>=0);
  console.log(T.join('\n'));
  console.log('CHECK_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
