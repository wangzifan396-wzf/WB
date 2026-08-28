
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[]; function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var a=A.downloadTime(1e6, 8); ok('dlt 1s', Math.abs(a.seconds-1)<1e-9);
  var b=A.downloadTime(1e6, 1); ok('dlt 8s', Math.abs(b.seconds-8)<1e-9);
  ok('dlt human 90', A.fmtDuration(90)==='1 分 30 秒');
  ok('dlt bad bw', A.downloadTime(1e6, 0).ok===false);
  console.log(T.join('\n'));
  console.log('DLT_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
