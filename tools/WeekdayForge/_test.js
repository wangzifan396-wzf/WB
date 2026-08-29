
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.dateInfo('2026-01-01');
  ok('wd ok', a.ok===true);
  ok('wd weekday', a.weekday==='星期四');
  ok('wd doy', a.dayOfYear===1);
  ok('wd leap 2024', A.dateInfo('2024-06-01').leap===true);
  ok('wd leap 2026', A.dateInfo('2026-06-01').leap===false);
  ok('wd week range', a.isoWeek>=1 && a.isoWeek<=53);
  ok('wd bad', A.dateInfo('zzz').ok===false);
  console.log(T.join('\n'));
  console.log('WD_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
