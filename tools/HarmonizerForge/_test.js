
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:200},function(_,i){return Math.sin(i*0.3);});
  var a=A.harmonizeAnalyze(sig,12,0.5);
  ok('harm length', a.length===200);
  ok('harm ratio', Math.abs(a.ratio-2)<1e-9);
  ok('harm peak finite', isFinite(a.peak));
  var un=A.harmonizeProcess(sig,0,1);
  var maxd=0; for(var i=0;i<200;i++) maxd=Math.max(maxd, Math.abs(un[i]-sig[i]));
  ok('harm 0 semitone ~identity', maxd<1e-9);
  ok('harm zero', Math.abs(A.harmonizeAnalyze(new Array(40).fill(0),7,0.5).rms)<1e-9);
  console.log(T.join('\n'));
  console.log('HARMONIZER_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
