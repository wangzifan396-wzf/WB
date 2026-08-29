
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  ok('sigfig 1.23456/3', A.toSignificantFigures(1.23456,3).value==='1.23');
  ok('sigfig 0.000123456/2', A.toSignificantFigures(0.000123456,2).value==='0.00012');
  ok('sigfig 12345/3 expand', A.toSignificantFigures(12345,3).value==='12300');
  ok('sigfig 100/1', A.toSignificantFigures(100,1).value==='100');
  ok('sigfig zero', A.toSignificantFigures(0,3).value==='0');
  ok('sigfig bad', A.toSignificantFigures('abc',3).ok===false);
  ok('sigfig bad digits', A.toSignificantFigures(1.23, 0).ok===false);
  console.log(T.join('\n'));
  console.log('SIGFIG_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
