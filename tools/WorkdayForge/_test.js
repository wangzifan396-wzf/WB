
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.workdays('2026-09-01','2026-09-07');
  ok('workday basic', a.ok && a.days===5);
  ok('workday dates', a.dates[0]==='2026-09-01');
  var b=A.workdays('2026-09-01','2026-09-07',{holidays:['2026-09-02']});
  ok('workday holiday', b.days===4);
  var c=A.workdays('2026-09-07','2026-09-01');
  ok('workday reversed', c.days===5);
  var d=A.workdays('2026-09-05','2026-09-06');
  ok('workday weekend only', d.days===0);
  ok('workday bad', A.workdays('zzz','2026-09-01').ok===false);
  ok('workday string holidays', A.workdays('2026-09-01','2026-09-07',{holidays:'2026-09-02, 2026-09-03'}).days===3);
  console.log(T.join('\n'));
  console.log('WORKDAY_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
