
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var c={efactor:2.5,repetitions:0,intervalDays:0};
  var r1=A.reviewCard(c,5,'2026-08-23');
  ok('first rep interval 1', r1.intervalDays===1);
  ok('first rep repcount 1', r1.repetitions===1);
  ok('ef increased', r1.efactor>=2.5);
  ok('due after today', r1.dueDate>'2026-08-23');
  var r2=A.reviewCard({efactor:r1.efactor,repetitions:1,intervalDays:1},4,'2026-08-24');
  ok('second rep interval 6', r2.intervalDays===6);
  // 失败（quality<3）重置
  var rf=A.reviewCard({efactor:3,repetitions:5,intervalDays:30},1,'2026-08-24');
  ok('fail resets rep', rf.repetitions===0 && rf.intervalDays===1);
  // EF 下限 1.3
  var re=A.reviewCard({efactor:1.3,repetitions:2,intervalDays:6},0,'2026-08-24');
  ok('ef floor 1.3', re.efactor===1.3);
  // 预览 6 档
  var pv=A.nextDuePreview(c,'2026-08-23');
  ok('preview 6 entries', pv.length===6);
  console.log(T.join('\n'));
  console.log('SPACEDREP_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
