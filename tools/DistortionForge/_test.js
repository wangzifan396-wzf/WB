
const fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const m=html.match(/<script>([\s\S]*?)<\/script>/);const fn=new Function('module','exports','require',m[1]);
const mod={exports:{}};fn(mod,mod.exports,require);const A=mod.exports;

function rngFactory(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }


function approx(a,b,e){ return Math.abs(a-b) <= (e||1e-6); }
(function(){
  var T=[];
  function ok(n,c){ T.push((c?'PASS':'FAIL')+' '+n); if(!c) throw new Error('assert failed: '+n); }
  var sig=Array.from({length:200},function(_,i){return Math.sin(i*0.3);});
  var soft=A.distortAnalyze(sig,{type:'soft',drive:3,mix:1});
  ok('dist length', soft.length===200);
  ok('dist peak finite', isFinite(soft.peak)&&soft.peak>=0);
  ok('dist soft peak<=1', soft.peak<=1+1e-9);
  var z=A.distortAnalyze(new Array(50).fill(0),{type:'soft',drive:3});
  ok('dist zero rms 0', approx(z.rms,0,1e-9));
  var hard=A.distortAnalyze(Array.from({length:200},function(){return 5;}),{type:'hard',drive:1});
  ok('dist hard clipped', hard.clippedSamples>0 && hard.peak<=1+1e-9);
  var fold=A.distortAnalyze(sig,{type:'fold',drive:4,threshold:0.7});
  ok('dist fold finite', isFinite(fold.peak)&&fold.peak>=0);
  console.log(T.join('\n'));
  console.log('DISTORTION_TEST_DONE total='+T.length+' pass='+T.filter(function(x){return x[0]==='P';}).length);
})();
