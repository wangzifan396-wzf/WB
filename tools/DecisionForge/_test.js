
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.decisionMatrix({options:'自建,采购', criteria:'成本\n交付速度'});
  ok('decide header', s.indexOf('| 方案 | 成本 | 交付速度 | 加权合计 |')>=0);
  ok('decide rows', s.indexOf('| 自建 |')>=0 && s.indexOf('| 采购 |')>=0);
  ok('decide weight', s.indexOf('## 权重（合计 100%）')>=0);
  ok('decide conclusion', s.indexOf('## 结论')>=0);
  var d=A.decisionMatrix({});
  ok('decide defaults', d.indexOf('方案 A')>=0 && d.indexOf('成本')>=0);
  console.log(T.join('\n'));
  console.log('DECIDE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
