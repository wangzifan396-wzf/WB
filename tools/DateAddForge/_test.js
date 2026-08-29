
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('dateadd day', A.dateAdd('2026-01-01',{n:10,unit:'day'}).value==='2026-01-11');
  ok('dateadd week', A.dateAdd('2026-01-01',{n:2,unit:'week'}).value==='2026-01-15');
  ok('dateadd month clamp', A.dateAdd('2026-01-31',{n:1,unit:'month'}).value==='2026-02-28');
  ok('dateadd year', A.dateAdd('2026-01-01',{n:1,unit:'year'}).value==='2027-01-01');
  ok('dateadd negative', A.dateAdd('2026-03-01',{n:-1,unit:'day'}).value==='2026-02-28');
  ok('dateadd bad date', A.dateAdd('not-a-date',{n:1}).ok===false);
  ok('dateadd bad unit', A.dateAdd('2026-01-01',{n:1,unit:'zzz'}).ok===false);
  console.log(T.join('\n'));
  console.log('DATEADD_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
