
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:200},function(_,i){return Math.sin(i*0.2);});
  var a=A.flangerAnalyze(sig,44100,{rate:0.3,depthMs:5,mix:0.5,feedback:0.4});
  ok('flanger length', a.length===200);
  ok('flanger peak finite>=0', isFinite(a.peak)&&a.peak>=0);
  ok('flanger rms finite>=0', isFinite(a.rms)&&a.rms>=0);
  var z=A.flangerAnalyze(new Array(50).fill(0),8000,{});
  ok('flanger zero rms 0', Math.abs(z.rms)<1e-9);
  // depthMs=0 时延迟为 0，应近似原始信号（mix 影响）
  var d0=A.flangerAnalyze(sig,44100,{depthMs:0,mix:0.5,feedback:0});
  ok('flanger depthMs=0 finite', isFinite(d0.peak));
  console.log(T.join('\n'));
  console.log('FLANGER_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
