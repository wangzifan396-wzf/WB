
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var n=1000;
  var sig=Array.from({length:n},function(_,i){return Math.sin(i*0.1);});
  var a=A.granularAnalyze(sig,{grain:512,stretch:1.5,overlap:2});
  ok('gran length deterministic', a.outLength===Math.ceil(n*1.5)+512);
  ok('gran peak bounded', a.peak<=1+1e-9);
  ok('gran zero', Math.abs(A.granularAnalyze(new Array(40).fill(0),{grain:64,stretch:1.5}).rms)<1e-9);
  var s1=A.granularAnalyze(sig,{grain:512,stretch:1,overlap:2});
  ok('gran stretch1 length', s1.outLength===Math.ceil(n*1)+512);
  console.log(T.join('\n'));
  console.log('GRANULAR_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
