
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:100},function(_,i){return Math.sin(i*0.1);});
  var a=A.resampleAnalyze(sig,44100,22050,'linear');
  ok('resample outLen ~half', Math.abs(a.outLength - Math.round(100*22050/44100))<=1);
  ok('resample ratio', Math.abs(a.ratio - 22050/44100)<1e-9);
  ok('resample peak finite', isFinite(a.peak));
  // nearest 与 linear 长度一致
  var n=A.resampleAnalyze(sig,44100,88200,'nearest');
  ok('resample up ratio 2', Math.abs(n.ratio-2)<1e-9);
  // 升采样峰值不应爆炸（信号幅度有界）
  ok('resample peak bounded', a.peak<=1+1e-6 && n.peak<=1+1e-6);
  console.log(T.join('\n'));
  console.log('RESAMPLE_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
