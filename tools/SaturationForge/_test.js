
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:200},function(_,i){return Math.sin(i*0.3);});
  var a=A.saturateAnalyze(sig,{drive:1.5,mix:1});
  ok('sat length', a.length===200);
  ok('sat peak<=1', a.peak<=1+1e-9);
  ok('sat zero rms 0', Math.abs(A.saturateAnalyze(new Array(50).fill(0),{}).rms)<1e-9);
  ok('sat finite', isFinite(a.rms));
  var rawPeak=Math.max.apply(null, sig.map(Math.abs));
  ok('sat compresses', a.peak<=rawPeak+1e-9);
  console.log(T.join('\n'));
  console.log('SATURATION_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
