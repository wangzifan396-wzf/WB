
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var s=A.priorityMatrix({q1:'线上故障', q2:'架构重构', q3:'临时报表'});
  ok('prio title', s.indexOf('# 优先级矩阵（艾森豪威尔）')>=0);
  ok('prio 4 quadrants', s.indexOf('① 重要且紧急')>=0 && s.indexOf('② 重要不紧急')>=0 && s.indexOf('③ 紧急不重要')>=0 && s.indexOf('④ 不紧急不重要')>=0);
  ok('prio q1 item', s.indexOf('- [ ] 线上故障')>=0);
  ok('prio q2 item', s.indexOf('- [ ] 架构重构')>=0);
  ok('prio placeholder', s.indexOf('- [ ] ____')>=0);
  ok('prio tip', s.indexOf('把时间尽量推向 ②')>=0);
  console.log(T.join('\n'));
  console.log('PRIO_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
