
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.meetingNotes({title:'季度复盘', date:'2026-08-29', attendees:'张三 李四', topics:'增长\n成本'});
  ok('meet title', s.indexOf('# 季度复盘 会议纪要')>=0);
  ok('meet date', s.indexOf('- 时间：2026-08-29')>=0);
  ok('meet attendees', s.indexOf('张三、李四')>=0);
  ok('meet topics', s.indexOf('1. 增长')>=0 && s.indexOf('2. 成本')>=0);
  ok('meet sections', s.indexOf('## 结论')>=0 && s.indexOf('## 行动项')>=0);
  console.log(T.join('\n'));
  console.log('MEET_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
